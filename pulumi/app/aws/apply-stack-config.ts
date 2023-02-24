import {
  ApplyStackConfig,
  ApplyStackResult,
  GetStackConfig,
  StackConfig,
} from "@entities";
import * as aws from "@pulumi/aws";
import {
  getSharedResources,
  SharedResources,
} from "./usecases/stack/get-shared-resources";
import { applyClientConfig } from "./apply-client-config";
import { applyServiceConfig } from "./apply-service-config";
import { Output } from "@pulumi/pulumi";

const provider = new aws.Provider("aws", { region: "us-east-1" });

type Result = ApplyStackResult<Output<unknown>>;

export const applyStackConfig: ApplyStackConfig<Output<unknown>> = (
  config: StackConfig
): Result => {
  const result: Result = getSharedResources().apply((shared) =>
    createResources(config, shared)
  );
  return result;
};

function createResources(
  stackConfig: StackConfig,
  shared: SharedResources
): Result {
  // Pulumi adds `-` + 7 random chars for unique names.
  const shortName = stackConfig.appName.slice(0, 24);

  const cluster = new aws.ecs.Cluster(shortName, undefined, { provider });

  applyClientConfig(stackConfig, shared);

  const outputs: Record<string, Output<unknown>> = stackConfig.services
    .map((serviceConfig) => {
      return [
        serviceConfig.name,
        applyServiceConfig(
          stackConfig,
          serviceConfig,
          shared,
          cluster,
          provider
        ),
      ] as [string, ReturnType<typeof applyServiceConfig>];
    })
    .reduce((prev, [name, outputs]) => {
      return {
        ...prev,
        [`${name}TaskDefinitionArn`]: outputs.taskDefinitionArn,
        [`${name}Service`]: outputs.serviceName,
      };
    }, {});

  return {
    outputs: {
      ...outputs,
      cluster: cluster.name,
    },
  };
}

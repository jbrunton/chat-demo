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

type Result = ApplyStackResult<Result>;

export const applyStackConfig: ApplyStackConfig<Result> = (
  config: StackConfig
): Result => {
  return getSharedResources().apply((shared) =>
    createResources(config, shared)
  );
};

function createResources(
  stackConfig: StackConfig,
  shared: SharedResources
): Result {
  // Pulumi adds `-` + 7 random chars for unique names.
  const shortName = stackConfig.appName.slice(0, 24);

  const cluster = new aws.ecs.Cluster(shortName, undefined, { provider });

  applyClientConfig(stackConfig, shared);

  const taskDefinitions = stackConfig.services.map((serviceConfig) => {
    const taskDefinitionArn = applyServiceConfig(
      stackConfig,
      serviceConfig,
      shared,
      cluster,
      provider
    );
    return [serviceConfig.name, taskDefinitionArn];
  });
  return {
    outputs: Object.fromEntries(taskDefinitions),
  };
}

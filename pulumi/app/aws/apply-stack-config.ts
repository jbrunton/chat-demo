import { ApplyStackConfig, StackConfig } from "@entities";
import * as aws from "@pulumi/aws";
import {
  getSharedResources,
  SharedResources,
} from "./usecases/stack/get-shared-resources";
import { applyClientConfig } from "./apply-client-config";
import { applyServiceConfig } from "./apply-service-config";

const provider = new aws.Provider("aws", { region: "us-east-1" });

export const applyStackConfig: ApplyStackConfig = (config: StackConfig) => {
  getSharedResources().apply((shared) => createResources(config, shared));
};

function createResources(stackConfig: StackConfig, shared: SharedResources) {
  // Pulumi adds `-` + 7 random chars for unique names.
  const shortName = stackConfig.appName.slice(0, 24);

  const cluster = new aws.ecs.Cluster(shortName, undefined, { provider });

  applyClientConfig(stackConfig, shared);

  stackConfig.services.forEach((serviceConfig) => {
    applyServiceConfig(stackConfig, serviceConfig, shared, cluster, provider);
  });
}

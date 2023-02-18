import * as entities from "@entities";
import { StackConfig } from "@entities";
import * as usecases from "@usecases";
import { getDomainConfig } from "@usecases";

const rootDomain = "jbrunton-aws.com";

export const getStackConfig: entities.GetStackConfig = (
  inputs: entities.ApplicationInputs
): StackConfig => {
  const appConfig = usecases.getApplicationConfig(inputs);
  const client = {
    ...appConfig.client,
    ...getDomainConfig({
      ...appConfig,
      rootDomain,
      serviceName: appConfig.client.name,
    }),
  };
  const services = appConfig.services.map((service) => ({
    ...service,
    ...getDomainConfig({
      ...appConfig,
      rootDomain,
      serviceName: service.name,
    }),
  }));
  return {
    ...appConfig,
    client,
    services,
    rootDomain,
  };
};

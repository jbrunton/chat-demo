import { ApplicationInputs } from "@entities/application";
import { GetStackConfig, StackConfig } from "@entities/stack";
import { getApplicationConfig } from "@usecases/application/get-application-config";
import { getDomainConfig } from "@usecases/domain/get-domain-config";

const rootDomain = "jbrunton-aws.com";

export const getStackConfig: GetStackConfig = (
  inputs: ApplicationInputs
): StackConfig => {
  const appConfig = getApplicationConfig(inputs);
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

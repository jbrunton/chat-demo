import * as entities from "@entities";
import * as usecases from "@usecases";

export type StackConfig = entities.ApplicationConfig & entities.DomainConfig;

export const getStackConfig: entities.GetStackConfig<StackConfig> = (
  inputs: entities.ApplicationInputs
): StackConfig => {
  const appConfig = usecases.getApplicationConfig(inputs);
  const domainConfig = usecases.getDomainConfig({
    rootDomain: "jbrunton-aws.com",
    ...appConfig,
    serviceName: inputs.serviceName,
  });
  return {
    ...appConfig,
    ...domainConfig,
  };
};

import { DomainInputs, GetDomainConfig } from "@entities/domain";

export const getDomainConfig: GetDomainConfig = (inputs: DomainInputs) => {
  const domain = getDomainName(inputs);
  const publicUrl = `https://${domain}`;
  return {
    domain,
    publicUrl,
    rootDomain: inputs.rootDomain,
  };
};

const getDomainName = (inputs: DomainInputs): string => {
  const subdomain = getSubdomain(inputs);
  switch (inputs.environment) {
    case "production":
      return `${subdomain}.${inputs.rootDomain}`;
    case "staging":
      return `${subdomain}.staging.${inputs.rootDomain}`;
    case "development":
      return `${subdomain}.dev.${inputs.rootDomain}`;
  }
};

const getSubdomain = ({
  stackName,
  serviceName,
  environment,
}: DomainInputs): string => {
  const isClient = serviceName === "client";
  switch (environment) {
    case "development":
      return isClient
        ? `auth0-test-${stackName}`
        : `auth0-test-${serviceName}-${stackName}`;
    default:
      return isClient ? `auth0-test` : `auth0-test-${serviceName}`;
  }
};

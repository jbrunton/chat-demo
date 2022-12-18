import { getDomainConfig } from "./get-domain-config";

describe("getDomainConfig", () => {
  it("returns production domain when the environment is production", () => {
    const config = getDomainConfig({
      environment: "production",
      stackName: "production",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "auth0-test.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://auth0-test.jbrunton-aws.com",
    });
  });

  it("returns staging domain when the environment is production", () => {
    const config = getDomainConfig({
      environment: "staging",
      stackName: "staging",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "auth0-test.staging.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://auth0-test.staging.jbrunton-aws.com",
    });
  });

  it("returns a dev domain when the environment is development", () => {
    const config = getDomainConfig({
      environment: "development",
      stackName: "my-branch",
      rootDomain: "jbrunton-aws.com",
      serviceName: "client",
    });
    expect(config).toEqual({
      domain: "auth0-test-my-branch.dev.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://auth0-test-my-branch.dev.jbrunton-aws.com",
    });
  });

  it("appends the service name for backend services", () => {
    const apiConfig = {
      rootDomain: "jbrunton-aws.com",
      serviceName: "api",
    };
    expect(
      getDomainConfig({
        environment: "production",
        stackName: "production",
        ...apiConfig,
      })
    ).toEqual({
      domain: "auth0-test-api.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://auth0-test-api.jbrunton-aws.com",
    });
    expect(
      getDomainConfig({
        environment: "development",
        stackName: "my-branch",
        ...apiConfig,
      })
    ).toEqual({
      domain: "auth0-test-api-my-branch.dev.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
      publicUrl: "https://auth0-test-api-my-branch.dev.jbrunton-aws.com",
    });
  });
});

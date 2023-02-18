import { ApplicationInputs } from "@entities";
import { getApplicationConfig } from "./get-application-config";

jest.mock("@common/random");

describe("getApplicationConfig", () => {
  const inputs: ApplicationInputs = {
    stackName: "dev",
    services: [
      {
        name: "api",
        repository: "jbrunton/api",
        tag: "latest",
      },
    ],
  };

  it("returns the application configuration", () => {
    const config = getApplicationConfig(inputs);
    expect(config).toEqual({
      stackName: "dev",
      appName: "auth0-test-dev",
      environment: "development",
      protect: false,
      client: {
        name: "client",
      },
      services: inputs.services,
    });
  });

  describe(".protect", () => {
    it("returns true for production", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "production",
      });
      expect(config.protect).toEqual(true);
    });

    it("returns false for staging", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "staging",
      });
      expect(config.protect).toEqual(false);
    });

    it("returns false for other stack names", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "dev",
      });
      expect(config.protect).toEqual(false);
    });
  });

  describe(".environment", () => {
    it("returns 'production' for production", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "production",
      });
      expect(config.environment).toEqual("production");
    });

    it("returns 'staging' for staging", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "staging",
      });
      expect(config.environment).toEqual("staging");
    });

    it("returns 'development' for other stack names", () => {
      expect(
        getApplicationConfig({
          ...inputs,
          stackName: "dev",
        }).environment
      ).toEqual("development");
      expect(
        getApplicationConfig({
          ...inputs,
          stackName: "foo-bar",
        }).environment
      ).toEqual("development");
      expect(
        getApplicationConfig({
          ...inputs,
          stackName: "deps-lib-123.x",
        }).environment
      ).toEqual("development");
    });
  });

  describe(".appName", () => {
    it("prepends auth0-test", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "dev",
      });
      expect(config.appName).toEqual("auth0-test-dev");
    });

    it("truncates names greater than 32 chars long", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "deps-some-long-name-lib-3.x",
      });
      expect(config.appName).toEqual("auth0-test-deps-some-long-n-a1a1");
      expect(config.appName.length).toEqual(32);
    });

    it("removes illegal characters", () => {
      const config = getApplicationConfig({
        ...inputs,
        stackName: "deps-some-lib-3.x",
      });
      expect(config.appName).toEqual("auth0-test-deps-some-lib-3x");
    });
  });
});

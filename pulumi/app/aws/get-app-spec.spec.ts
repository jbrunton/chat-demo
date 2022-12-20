import { getTaskDefinitionSpec } from "./get-app-spec";
import { StackConfig } from "./usecases/stack/get-stack-config";

describe("getTaskDefinitionSpec", () => {
  it("generates a TaskDefinition spec for the given stack configuration", () => {
    const config: StackConfig = {
      stackName: "test",
      appName: "auth0-test-test",
      tag: "latest",
      environment: "development",
      protect: false,
      domain: "auth0-test-test.dev.jbrunton-aws.com",
      publicUrl: "https://auth0-test-test.dev.jbrunton-aws.com",
      rootDomain: "jbrunton-aws.com",
    };
    const spec = getTaskDefinitionSpec(
      config,
      "executionRoleArn",
      "/ecs/auth0-test-logs"
    );
    expect(spec).toEqual({
      family: "auth0-test-test",
      cpu: "256",
      memory: "512",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      executionRoleArn: "executionRoleArn",
      containerDefinitions: JSON.stringify([
        {
          name: "auth0-test-api",
          image: "jbrunton/auth0-test-api:latest",
          portMappings: [
            {
              containerPort: 8080,
              hostPort: 8080,
              protocol: "tcp",
            },
          ],
          environment: [
            {
              name: "PORT",
              value: "8080",
            },
            {
              name: "NO_COLOR",
              value: "1",
            },
            {
              name: "ENVIRONMENT",
              value: "development",
            },
            {
              name: "TAG",
              value: "latest",
            },
          ],
          secrets: [],
          logConfiguration: {
            logDriver: "awslogs",
            options: {
              "awslogs-group": "/ecs/auth0-test-logs",
              "awslogs-region": "us-east-1",
              "awslogs-stream-prefix": "ecs",
            },
          },
        },
      ]),
    });
  });
});

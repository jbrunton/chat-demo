import { ApplicationConfig, ServiceConfig } from "@entities";
import { getTaskDefinitionSpec } from "./get-app-spec";

describe("getTaskDefinitionSpec", () => {
  it("generates a TaskDefinition spec for the given stack configuration", () => {
    const serviceConfig: ServiceConfig = {
      name: "auth0-test-api",
      repository: "auth0-test-api",
      tag: "latest",
    };
    const appConfig: ApplicationConfig = {
      stackName: "test",
      appName: "auth0-test-test",
      environment: "development",
      protect: false,
      client: {
        name: "client",
      },
      services: [serviceConfig],
    };
    const spec = getTaskDefinitionSpec({
      appConfig,
      serviceConfig,
      executionRoleArn: "executionRoleArn",
      taskRoleArn: "taskRoleArn",
      logGroupName: "/ecs/auth0-test-logs",
      tableName: "MyTable",
    });
    expect(spec).toEqual({
      family: "auth0-test-test",
      cpu: "256",
      memory: "512",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      executionRoleArn: "executionRoleArn",
      taskRoleArn: "taskRoleArn",
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
            {
              name: "DB_TABLE_NAME",
              value: "MyTable",
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

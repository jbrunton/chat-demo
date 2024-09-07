import { ApplicationConfig, ServiceConfig } from "@entities";
import { getTaskDefinitionSpec } from "./get-app-spec";

describe("getTaskDefinitionSpec", () => {
  it("generates a TaskDefinition spec for the given stack configuration", () => {
    const serviceConfig: ServiceConfig = {
      name: "chat-demo-api",
      repository: "chat-demo-api",
      tag: "latest",
    };
    const appConfig: ApplicationConfig = {
      stackName: "test",
      appName: "chat-demo-test",
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
      logGroupName: "/ecs/chat-demo-logs",
      tableName: "MyTable",
    });
    expect(spec).toEqual({
      family: "chat-demo-test",
      cpu: "256",
      memory: "512",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      executionRoleArn: "executionRoleArn",
      taskRoleArn: "taskRoleArn",
      containerDefinitions: JSON.stringify([
        {
          name: "chat-demo-api",
          image: "jbrunton/chat-demo-api:latest",
          portMappings: [
            {
              containerPort: 8080,
              hostPort: 8080,
              protocol: "tcp",
            },
          ],
          healthCheck: {
            retries: 3,
            command: ["CMD-SHELL", "curl -f http://localhost:8080/ || exit 1"],
            timeout: 5,
            interval: 30,
            startPeriod: 5,
          },
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
              "awslogs-group": "/ecs/chat-demo-logs",
              "awslogs-region": "us-east-1",
              "awslogs-stream-prefix": "ecs",
            },
          },
        },
      ]),
    });
  });
});

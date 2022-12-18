import * as aws from "@pulumi/aws";
import { StackConfig } from "./usecases/stack/get-stack-config";

export const getTaskDefinitionSpec = (
  config: StackConfig,
  executionRoleArn: string,
  logGroupName: string
): aws.ecs.TaskDefinitionArgs => {
  return {
    family: config.appName,
    cpu: "256",
    memory: "512",
    networkMode: "awsvpc",
    requiresCompatibilities: ["FARGATE"],
    executionRoleArn,
    containerDefinitions: JSON.stringify([
      {
        name: "auth0-test-api",
        image: `jbrunton/auth0-test-api:${config.tag}`,
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
            value: config.environment,
          },
          {
            name: "TAG",
            value: config.tag,
          },
        ],
        secrets: [],
        logConfiguration: {
          logDriver: "awslogs",
          options: {
            "awslogs-group": logGroupName,
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "ecs",
          },
        },
      },
    ]),
  };
};

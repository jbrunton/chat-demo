import { ApplicationConfig, ServiceConfig } from "@entities";
import * as aws from "@pulumi/aws";

export type GetTaskDefinitionSpecParams = {
  appConfig: ApplicationConfig;
  serviceConfig: ServiceConfig;
  executionRoleArn: string;
  taskRoleArn: string;
  logGroupName: string;
  tableName: string;
};

export const getTaskDefinitionSpec = ({
  appConfig,
  serviceConfig,
  executionRoleArn,
  taskRoleArn,
  logGroupName,
  tableName,
}: GetTaskDefinitionSpecParams): aws.ecs.TaskDefinitionArgs => {
  return {
    family: appConfig.appName,
    cpu: "256",
    memory: "512",
    networkMode: "awsvpc",
    requiresCompatibilities: ["FARGATE"],
    taskRoleArn,
    executionRoleArn,
    containerDefinitions: JSON.stringify([
      {
        name: "chat-demo-api",
        image: `jbrunton/${serviceConfig.repository}:${serviceConfig.tag}`,
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
            value: appConfig.environment,
          },
          {
            name: "TAG",
            value: serviceConfig.tag,
          },
          {
            name: "DB_TABLE_NAME",
            value: tableName,
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

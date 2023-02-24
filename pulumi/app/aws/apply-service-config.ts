import { ApplyStackResult, StackConfig } from "@entities";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getTaskDefinitionSpec } from "./get-app-spec";
import { SharedResources } from "./usecases/stack/get-shared-resources";
import { Cluster } from "@pulumi/aws/ecs";
import { Output } from "@pulumi/pulumi";

export const applyServiceConfig = (
  stackConfig: StackConfig,
  serviceConfig: StackConfig["services"][0],
  shared: SharedResources,
  cluster: Cluster,
  provider: aws.Provider
): {
  serviceName: Output<string>;
  taskDefinitionArn: Output<string>;
} => {
  const resourceName = `${stackConfig.appName}-${serviceConfig.name}`;

  // Pulumi sometimes adds `-` + 7 random chars for unique names.
  const shortName = resourceName.slice(0, 24);

  const subnets = aws.ec2.getSubnetsOutput(
    {
      filters: [
        {
          name: "vpc-id",
          values: [shared.vpcId],
        },
      ],
    },
    { provider }
  );

  const targetGroup = new aws.lb.TargetGroup(shortName, {
    port: 80,
    protocol: "HTTP",
    targetType: "ip",
    vpcId: shared.vpcId,
  });

  new aws.lb.ListenerRule(resourceName, {
    listenerArn: shared.loadBalancer.defaultListenerArn,
    actions: [
      {
        type: "forward",
        targetGroupArn: targetGroup.arn,
      },
    ],
    conditions: [
      {
        hostHeader: {
          values: [serviceConfig.domain],
        },
      },
    ],
  });

  const taskExecutionRole = new aws.iam.Role(`${resourceName}-exec-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: "ecs-tasks.amazonaws.com",
    }),
  });

  new aws.iam.RolePolicy(`${resourceName}-get-params`, {
    role: taskExecutionRole.name,
    policy: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["ssm:GetParameters", "kms:Decrypt"],
          Resource: [
            "arn:aws:ssm:us-east-1:030461922427:parameter/auth0-test/*",
          ],
        },
      ],
    },
  });

  new aws.iam.RolePolicyAttachment(`${resourceName}-exec-role-attachment`, {
    role: taskExecutionRole.name,
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  });

  const taskRole = new aws.iam.Role(`${resourceName}-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: "ecs-tasks.amazonaws.com",
    }),
  });

  new aws.iam.RolePolicy(`${resourceName}-dynamo-db`, {
    role: taskRole.name,
    policy: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["dynamodb:*"],
          Resource: ["*"],
        },
      ],
    },
  });

  new aws.iam.RolePolicyAttachment(`${resourceName}-role-attachment`, {
    role: taskRole.name,
    policyArn: aws.iam.ManagedPolicy.AmazonECSFullAccess,
  });

  const webLogGroup = new aws.cloudwatch.LogGroup(
    `/ecs/${resourceName}`,
    {
      tags: {
        Stack: stackConfig.stackName,
        Environment: stackConfig.environment,
      },
      retentionInDays: 30,
    },
    { provider }
  );

  const securityGroup = new aws.ec2.SecurityGroup(`${resourceName}-sg`, {
    vpcId: shared.vpcId,
    description: "Internal HTTP access",
    ingress: [
      {
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
  });

  const table = new aws.dynamodb.Table(resourceName, {
    attributes: [
      { name: "Id", type: "S" },
      { name: "Sort", type: "S" },
    ],
    hashKey: "Id",
    rangeKey: "Sort",
    readCapacity: 1,
    writeCapacity: 1,
  });

  const outputs = pulumi
    .all([webLogGroup.name, taskExecutionRole.arn, taskRole.arn, table.name])
    .apply(([logGroupName, executionRoleArn, taskRoleArn, tableName]) => {
      const taskDefinitionSpec = getTaskDefinitionSpec({
        appConfig: stackConfig,
        serviceConfig,
        executionRoleArn,
        taskRoleArn,
        logGroupName,
        tableName,
      });
      const taskDefinition = new aws.ecs.TaskDefinition(
        stackConfig.appName,
        taskDefinitionSpec
      );

      const service = new aws.ecs.Service(stackConfig.appName, {
        cluster: cluster.arn,
        desiredCount: 1,
        launchType: "FARGATE",
        taskDefinition: taskDefinition.arn,
        networkConfiguration: {
          assignPublicIp: true,
          subnets: subnets.ids,
          securityGroups: [securityGroup.id],
        },
        loadBalancers: [
          {
            targetGroupArn: targetGroup.arn,
            containerName: "auth0-test-api",
            containerPort: 8080,
          },
        ],
      });

      return {
        taskDefinitionArn: taskDefinition.arn,
        serviceName: service.name,
      };
    });

  const lb = aws.lb.getLoadBalancerOutput({ arn: shared.loadBalancer.arn });

  const zoneId = aws.route53
    .getZone({ name: "jbrunton-aws.com" }, { provider })
    .then((zone) => zone.id);

  new aws.route53.Record(
    stackConfig.appName,
    {
      zoneId,
      name: serviceConfig.domain,
      type: "A",
      aliases: [
        {
          name: lb.dnsName,
          zoneId: lb.zoneId,
          evaluateTargetHealth: true,
        },
      ],
    },
    { provider }
  );

  return outputs;
};

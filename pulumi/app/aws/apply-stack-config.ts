import { ApplyStackConfig } from "@entities";
import { StackConfig } from "./usecases/stack/get-stack-config";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { getTaskDefinitionSpec } from "./get-app-spec";
import {
  getSharedResources,
  SharedResources,
} from "./usecases/stack/get-shared-resources";

const provider = new aws.Provider("aws", { region: "us-east-1" });

export const applyStackConfig: ApplyStackConfig<StackConfig> = (
  config: StackConfig
) => {
  getSharedResources().apply((shared) => createResources(config, shared));
};

function createResources(config: StackConfig, shared: SharedResources) {
  // Pulumi adds `-` + 7 random chars for unique names.
  const shortName = config.appName.slice(0, 24);

  const cluster = new aws.ecs.Cluster(shortName, undefined, { provider });

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

  new aws.lb.ListenerRule(config.appName, {
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
          values: [config.domain],
        },
      },
    ],
  });

  const taskExecutionRole = new aws.iam.Role(`${config.appName}-exec-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: "ecs-tasks.amazonaws.com",
    }),
  });

  new aws.iam.RolePolicy(`${config.appName}-get-params`, {
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

  new aws.iam.RolePolicyAttachment(`${config.appName}-exec-role-attachment`, {
    role: taskExecutionRole.name,
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  });

  const taskRole = new aws.iam.Role(`${config.appName}-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: "ecs-tasks.amazonaws.com",
    }),
  });

  new aws.iam.RolePolicy(`${config.appName}-dynamo-db`, {
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

  new aws.iam.RolePolicyAttachment(`${config.appName}-role-attachment`, {
    role: taskRole.name,
    policyArn: aws.iam.ManagedPolicy.AmazonECSFullAccess,
  });

  const webLogGroup = new aws.cloudwatch.LogGroup(
    `/ecs/${config.appName}`,
    {
      tags: {
        Stack: config.stackName,
        Environment: config.environment,
      },
      retentionInDays: 30,
    },
    { provider }
  );

  const securityGroup = new aws.ec2.SecurityGroup(config.appName, {
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

  const table = new aws.dynamodb.Table(config.appName, {
    attributes: [
      { name: "Id", type: "S" },
      { name: "Sort", type: "S" },
    ],
    hashKey: "Id",
    rangeKey: "Sort",
    readCapacity: 1,
    writeCapacity: 1,
  });

  pulumi
    .all([webLogGroup.name, taskExecutionRole.arn, taskRole.arn, table.name])
    .apply(([logGroupName, executionRoleArn, taskRoleArn, tableName]) => {
      const taskDefinitionSpec = getTaskDefinitionSpec({
        config,
        executionRoleArn,
        taskRoleArn,
        logGroupName,
        tableName,
      });
      const taskDefinition = new aws.ecs.TaskDefinition(
        config.appName,
        taskDefinitionSpec
      );

      new aws.ecs.Service(config.appName, {
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
    });

  const lb = aws.lb.getLoadBalancerOutput({ arn: shared.loadBalancer.arn });

  const zoneId = aws.route53
    .getZone({ name: "jbrunton-aws.com" }, { provider })
    .then((zone) => zone.id);

  new aws.route53.Record(
    config.appName,
    {
      zoneId,
      name: config.domain,
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
}

import * as pulumi from "@pulumi/pulumi";

export type SharedResources = {
  loadBalancer: {
    arn: string;
    defaultListenerArn: string;
  };
  securityGroupId: string;
  vpcId: string;
  certificateArn: string;
};

const shared = new pulumi.StackReference(
  "jbrunton/jbrunton-aws.com-infra/prod"
);

export const getSharedResources = (): pulumi.Output<SharedResources> => {
  return pulumi
    .all([
      shared.getOutput("loadBalancerArn"),
      shared.getOutput("listenerArn"),
      shared.getOutput("securityGroupId"),
      shared.getOutput("vpcId"),
      shared.getOutput("certificateArn"),
    ])
    .apply(
      ([
        loadBalancerArn,
        listenerArn,
        securityGroupId,
        vpcId,
        certificateArn,
      ]) => {
        const shared: SharedResources = {
          loadBalancer: {
            arn: loadBalancerArn,
            defaultListenerArn: listenerArn,
          },
          securityGroupId,
          vpcId,
          certificateArn,
        };
        return shared;
      }
    );
};

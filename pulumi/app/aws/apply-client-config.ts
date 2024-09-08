import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";
import { SharedResources } from "./usecases/stack/get-shared-resources";
import { StackConfig } from "@entities";
import { PolicyDocument } from "@pulumi/aws/iam";

export const applyClientConfig = (
  stackConfig: StackConfig,
  shared: SharedResources
) => {
  const zone = aws.route53.getZoneOutput({ name: "jbrunton-aws.com" });
  const namePrefix = `chat-demo-${stackConfig.stackName}`;

  // Create an S3 bucket and configure it as a website.
  const bucket = new aws.s3.Bucket(`${namePrefix}-bucket`, {
    bucket: stackConfig.client.domain,
    website: {
      indexDocument: "index.html",
    },
  });

  const ownershipControls = new aws.s3.BucketOwnershipControls(
    "ownership-controls",
    {
      bucket: bucket.bucket,
      rule: {
        objectOwnership: "ObjectWriter",
      },
    },
    { dependsOn: [bucket] }
  );

  const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(
    `${namePrefix}-access`,
    {
      blockPublicAcls: false,
      bucket: bucket.bucket,
    }
  );

  new aws.s3.BucketPolicy(
    `${namePrefix}-policy`,
    {
      bucket: bucket.bucket,
      policy: bucket.bucket.apply(publicReadPolicyForBucket),
    },
    {
      dependsOn: [publicAccessBlock],
    }
  );

  function publicReadPolicyForBucket(bucketName: string): PolicyDocument {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
  }

  // Use a synced folder to manage the files of the website.
  new synced_folder.S3BucketFolder(
    `${namePrefix}-folder`,
    {
      path: "../client/dist",
      bucketName: bucket.bucket,
      acl: aws.s3.PublicReadAcl,
    },
    { dependsOn: [publicAccessBlock, ownershipControls] }
  );

  // Create a CloudFront CDN to distribute and cache the website.
  // const cdn = new aws.cloudfront.Distribution(`${namePrefix}-cdn`, {
  //   enabled: true,
  //   origins: [
  //     {
  //       originId: bucket.arn,
  //       domainName: bucket.websiteEndpoint,
  //       customOriginConfig: {
  //         originProtocolPolicy: "http-only",
  //         httpPort: 80,
  //         httpsPort: 443,
  //         originSslProtocols: ["TLSv1.2"],
  //       },
  //     },
  //   ],
  //   defaultCacheBehavior: {
  //     targetOriginId: bucket.arn,
  //     viewerProtocolPolicy: "redirect-to-https",
  //     allowedMethods: ["GET", "HEAD", "OPTIONS"],
  //     cachedMethods: ["GET", "HEAD", "OPTIONS"],
  //     defaultTtl: 600,
  //     maxTtl: 600,
  //     minTtl: 600,
  //     forwardedValues: {
  //       queryString: true,
  //       cookies: {
  //         forward: "all",
  //       },
  //     },
  //   },
  //   priceClass: "PriceClass_100",
  //   restrictions: {
  //     geoRestriction: {
  //       restrictionType: "none",
  //     },
  //   },
  //   aliases: [stackConfig.client.domain],
  //   viewerCertificate: {
  //     cloudfrontDefaultCertificate: false,
  //     acmCertificateArn: shared.certificateArn,
  //     sslSupportMethod: "sni-only",
  //   },
  //   customErrorResponses: [
  //     { responsePagePath: "/index.html", responseCode: 200, errorCode: 404 },
  //   ],
  // });

  new aws.route53.Record(stackConfig.client.domain, {
    name: stackConfig.client.domain,
    zoneId: zone.zoneId,
    type: "A",
    aliases: [
      {
        name: stackConfig.client.domain,
        zoneId: zone.id,
        evaluateTargetHealth: true,
      },
    ],
  });
};

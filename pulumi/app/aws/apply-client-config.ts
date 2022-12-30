import { StackConfig } from "./usecases/stack/get-stack-config";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";
import { SharedResources } from "./usecases/stack/get-shared-resources";

export const applyClientConfig = (
  config: StackConfig,
  shared: SharedResources
) => {
  const zone = aws.route53.getZoneOutput({ name: "jbrunton-aws.com" });
  const namePrefix = `auth0-test-${config.stackName}`;

  // Create an S3 bucket and configure it as a website.
  const bucket = new aws.s3.Bucket(`${namePrefix}-bucket`, {
    acl: "public-read",
    website: {
      indexDocument: "index.html",
    },
  });

  // Use a synced folder to manage the files of the website.
  new synced_folder.S3BucketFolder(`${namePrefix}-folder`, {
    path: "../client/dist",
    bucketName: bucket.bucket,
    acl: "public-read",
  });

  // Create a CloudFront CDN to distribute and cache the website.
  const cdn = new aws.cloudfront.Distribution(`${namePrefix}-cdn`, {
    enabled: true,
    origins: [
      {
        originId: bucket.arn,
        domainName: bucket.websiteEndpoint,
        customOriginConfig: {
          originProtocolPolicy: "http-only",
          httpPort: 80,
          httpsPort: 443,
          originSslProtocols: ["TLSv1.2"],
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: bucket.arn,
      viewerProtocolPolicy: "redirect-to-https",
      allowedMethods: ["GET", "HEAD", "OPTIONS"],
      cachedMethods: ["GET", "HEAD", "OPTIONS"],
      defaultTtl: 600,
      maxTtl: 600,
      minTtl: 600,
      forwardedValues: {
        queryString: true,
        cookies: {
          forward: "all",
        },
      },
    },
    priceClass: "PriceClass_100",
    restrictions: {
      geoRestriction: {
        restrictionType: "none",
      },
    },
    aliases: [config.domain],
    viewerCertificate: {
      cloudfrontDefaultCertificate: false,
      acmCertificateArn: shared.certificateArn,
      sslSupportMethod: "sni-only",
    },
    customErrorResponses: [
      { responsePagePath: "/index.html", responseCode: 200, errorCode: 404 },
    ],
  });

  new aws.route53.Record(config.domain, {
    name: config.domain,
    zoneId: zone.zoneId,
    type: "A",
    aliases: [
      {
        name: cdn.domainName,
        zoneId: cdn.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  });
};

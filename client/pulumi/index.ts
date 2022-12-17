import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as synced_folder from "@pulumi/synced-folder";

const getDomain = (stack: string): string => {
  switch (stack) {
    case "production":
      return "auth0-test.jbrunton-aws.com";
    case "staging":
      return "auth0-test.staging.jbrunton-aws.com";
    default:
      return `auth0-test-${stack}.dev.jbrunton-aws.com`;
  }
};

const stack = pulumi.getStack();
const domain = getDomain(stack);
const namePrefix = `auth0-test-${stack}`;
const zone = aws.route53.getZoneOutput({ name: "jbrunton-aws.com" });

const certificateArn = aws.acm.getCertificate({
  domain: "*.jbrunton-aws.com",
  statuses: ["ISSUED"],
}).then(certificate => certificate.arn);

// Create an S3 bucket and configure it as a website.
const bucket = new aws.s3.Bucket(`${namePrefix}-bucket`, {
  acl: "public-read",
  website: {
    indexDocument: "index.html",
  },
});

// Use a synced folder to manage the files of the website.
new synced_folder.S3BucketFolder(`${namePrefix}-folder`, {
  path: "../app/dist",
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
  aliases: [domain],
  viewerCertificate: {
    cloudfrontDefaultCertificate: false,
    acmCertificateArn: certificateArn,
    sslSupportMethod: "sni-only",
  },
});

new aws.route53.Record(domain, {
  name: domain,
  zoneId: zone.zoneId,
  type: "A",
  aliases: [
      {
          name: cdn.domainName,
          zoneId: cdn.hostedZoneId,
          evaluateTargetHealth: true,
      }
  ],
});

export const url = `https://${domain}`;

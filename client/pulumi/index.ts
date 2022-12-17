import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws-native";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

let siteDir = "www"; // directory for content files

// For each file in the directory, create an S3 object stored in `siteBucket`
for (let item of require("fs").readdirSync(siteDir)) {
    let filePath = require("path").join(siteDir, item);
    let object = new aws.s3.BucketObject(item, {
      bucket: siteBucket,
      source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
}

// Export the name of the bucket
export const bucketName = bucket.id;

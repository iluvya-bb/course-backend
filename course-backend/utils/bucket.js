const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const { loadConfig } = require("../configs/config");
const conf = loadConfig();

const s3 = new S3Client({
  region: conf.aws.region, // Change this to your region
  credentials: {
    accessKeyId: conf.aws.accessKeyId,
    secretAccessKey: conf.aws.secretAccessKey,
  },
});

const BUCKET_NAME = conf.aws.s3Bucket;

exports.uploadLocalFile = async (filePath, key) => {
  await console.log(filePath, key);

  const fileStream = await fs.createReadStream(filePath);

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: "application/octet-stream",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log(`File uploaded successfully: ${key}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

exports.getSignedUrlForFile = async (key) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
    console.log(`Signed URL: ${url}`);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
};

exports.listFiles = async () => {
  const command = new ListObjectsCommand({
    Bucket: BUCKET_NAME,
  });

  try {
    const { Contents } = await s3.send(command);
    console.log("Files in bucket:");
    Contents.forEach((file) => console.log(file.Key));
  } catch (error) {
    console.error("Error listing files:", error);
  }
};

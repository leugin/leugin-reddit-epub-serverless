
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

let client = null

const s3Credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
};
const initBucket = ()=> {
    const configuration = {
        forcePathStyle: true,
        credentials: {
            accessKeyId:s3Credentials.accessKeyId, // This specific key is required when working offline
            secretAccessKey: s3Credentials.secretAccessKey,
        }
    }
    if (process.env.IS_OFFLINE) {
        configuration.endpoint = process.env.BUCKET_URL || "http://localhost:4569"
    }
      return  new S3Client(configuration);
}

const checkAndGetClient = async () => {
    if (client == null) {
       client =  await initBucket()
    }
    return Promise.resolve(client)
}
const put = async (file, name) => {
    return new Promise(async (success, reject) => {const client = await checkAndGetClient()
       const response =  await client
            .send(
                new PutObjectCommand({
                    Bucket: s3Credentials.bucket,
                    Key: name,
                    Body: Buffer.from(file),
                })
            );
        success(response)
    }
)
}
module.exports = {
    checkAndGetClient,
    put
}

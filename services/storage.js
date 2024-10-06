
const { S3Client, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");

let client = null
const paths =  {
    temp:(fileName) => {
        return 'public/temp/' + fileName ;
    },
    books: (filename) => {
        return 'public/books/' + filename
    },
    images: (filename) => {
        return 'public/images/' + filename
    }
}

const url = (path)=> {
    return process.env.IS_OFFLINE ?
        `http://localhost:4569/${process.env.BUCKET_NAME}/${path}` :
        `https://reddit-epub-s3-database.s3.amazonaws.com/${path}`
}

const s3Credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.BUCKET_NAME,
};
const initBucket = ()=> {
    const configuration = {
        forcePathStyle: true
     }
    if (process.env.IS_OFFLINE) {
        configuration.credentials = {
            accessKeyId:s3Credentials.accessKeyId, // This specific key is required when working offline
            secretAccessKey: s3Credentials.secretAccessKey,
        }
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
    return new Promise(async (success) => {const client = await checkAndGetClient()
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
const save = async (path, name) => {
    return new Promise(async (success) => {const client = await checkAndGetClient()
       const response =  await client
            .send(
                new PutObjectCommand({
                    Bucket: s3Credentials.bucket,
                    Key: name,
                    Body: path,
                })
            );
        success(response)
    }
)
}
const get = async (path) => {
    const streamToString = (stream) => new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    return new Promise(async (success) => {const client = await checkAndGetClient()
        const params = {
            Bucket: s3Credentials.bucket,
            Key: path,
        };

        const command = new GetObjectCommand(params);
        const response = await client.send(command);

        const { Body } = response;
        const json = await streamToString(Body);

        success(json)
    }
)
}
module.exports = {
    checkAndGetClient,
    paths,
    get,
    save,
    put,
    url
}

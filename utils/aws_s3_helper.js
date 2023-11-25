const AWS = require('aws-sdk');
AWS.config.loadFromPath('./awsConfig.json');
const awsS3Service = new AWS.S3({ apiVersion: '2006-03-01' });
const path = require("path");

const aws_s3 = {
    getS3FileBuffer: async (file_key) =>{
        var fileBucketParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file_key
        };
        try {
            const data = await awsS3Service.getObject(fileBucketParams).promise();
            return data.Body;
        } catch (err) {
            console.log(`Error : ${err} , Error Stack: ${err.stack}`);
            return false;
        }
    },

    uploadFileUsingBuffer: async (fileBuffer, file_key) => {
        try {
            const fileUploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: file_key,
                Body: fileBuffer,
            }
            console.log("uploading file on s3");
            const fileUploadResult = await awsS3Service.upload(fileUploadParams).promise();
            if (!fileUploadResult) {
                console.log(`Error in Uploading File to s3`);
            }
            else {
                console.log(`File and Thumbnail Upload Successful! ${JSON.stringify(fileUploadResult)}`);
                return fileUploadResult.Key;
            }
        } catch (err) {
            console.log(`Error : ${err} , Error Stack: ${err.stack}`);
            return false;
        }
    },

    uploadDataToS3JsonFile: async (data, fileKey) => {
        try {
            const fileUploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileKey,
                Body: JSON.stringify(data),
                ContentType: 'application/json; charset=utf-8'
            }

            console.log("uploading file on s3");
            const fileUploadResult = await awsS3Service.putObject(fileUploadParams).promise();
            if (!fileUploadResult) {
                console.log(`Error in Uploading File to s3`);
            }
            else {
                console.log(`File and Thumbnail Upload Successful! ${JSON.stringify(fileUploadResult)}`);
                return fileKey;
            }
        } catch (err) {
            console.log(`Error : ${err} , Error Stack: ${err.stack}`);
            return false;
        }
    },

    getPresignedURL: async (keyForPresignedURL, is_upload = false) => {
        try {
            let operation = 'getObject';
            let contentType = "application/pdf";
            let linkExpiry = parseInt(process.env.S3_GET_PRESIGNED_EXPIRY);
            if(is_upload){
                operation = 'putObject'
                linkExpiry = parseInt(process.env.S3_UPLOAD_PRESIGNED_EXPIRY);
            }

            if(path.extname(keyForPresignedURL) === '.json'){
                contentType = "application/json";
            }else if(path.extname(keyForPresignedURL) === '.xlsx'){
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }else if(path.extname(keyForPresignedURL) === '.xls'){
                contentType = "application/vnd.ms-excel";
            }else if(keyForPresignedURL.match(/.(jpg|jpeg|png|apng|gif)$/i)){
                contentType = "image/" + path.extname(keyForPresignedURL).replace(".","");
            }else if(path.extname(keyForPresignedURL) === '.docx'){
                contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }

            // Create the parameters for calling listObjects
            var fileBucketParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: keyForPresignedURL,
                Expires: linkExpiry,
            };

            if(!is_upload){
                fileBucketParams.ResponseContentDisposition= `inline`;
                fileBucketParams.ResponseContentType= contentType;
            }else{
                fileBucketParams.ContentType= contentType;
            }

            const filePresignedUrl = await awsS3Service.getSignedUrlPromise(operation, fileBucketParams);
            console.log("presigned url generated successfully", filePresignedUrl);
            return filePresignedUrl;

        } catch (error) {
            // logger.error(`AWS S3 failed to list documents for user_id ${user_id}.`);
            console.log(`Error : ${error} , Error Stack: ${error.stack}`);
            return false;
        }
    },

    checkFileExistOnS3: async (bucketName, file_key) => {
        var fileBucketParams = {
          Bucket: bucketName,
          Key: file_key,
        };
        try {
            const data = await awsS3Service.headObject(fileBucketParams).promise();
            return true;
        } catch (err) {
            console.log(`File not Found ERROR : ${err}`);
            return false;
        }
    },
}

module.exports = aws_s3;

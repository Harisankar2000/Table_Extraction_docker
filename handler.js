"use strict";
const fs = require('fs');
const { PDFNet } = require('@pdftron/pdfnet-node');
const PDFTronLicense = require('./utils/LicenseKey.json');
const errorConstants = require("./constants/error.constants");
const apiResponse = require("./utils/response");
const { runDataExtraction } = require("./utils/table_extraction");
const awsS3 = require("./utils/aws_s3_helper");

exports.handler = async (event) => {
    try {
        const requestBody = event.body ? JSON.parse(event.body) : "";
        console.log("requestBody:: ", requestBody);
        const inputPdfPath = requestBody.inputPdfPath
            ? requestBody.inputPdfPath
            : null;

        if (!inputPdfPath) {
            console.log("inputPdfPath parameter missing");
            return apiResponse.sendFailureResponse({
                code: errorConstants.Invalid_Request_Data.code,
                statusCode: 400,
                message: errorConstants.Invalid_Request_Data.message,
            });
        }

        // Check if the specified PDF file exists in the current directory
        if (!fs.existsSync(inputPdfPath)) {
            console.log(`Error: Input PDF file not found - ${inputPdfPath}`);
            return apiResponse.sendFailureResponse({
                code: errorConstants.RECORD_NOT_FOUND.code,
                statusCode: 404,
                message: errorConstants.RECORD_NOT_FOUND.message,
            });
        }

        const extractedData = await runDataExtraction(inputPdfPath);
        console.log("THIS IS EXTRACTED DATA::", extractedData);

        // Upload extracted data to S3
        const s3OutputPath = "sirovate-backend-data/output/demo-final-CSR2.json";
        await awsS3.uploadDataToS3JsonFile(extractedData, s3OutputPath);

        PDFNet.runWithCleanup( await runDataExtraction, PDFTronLicense.Key).catch((error) =>{
            console.log('Error: ' + JSON.stringify(error));
          });


        return apiResponse.sendSuccessResponse({
            message: "Data extraction completed successfully",
            extractedData,
        });

    } catch (err) {
        console.log(`Error : ${err} , Error Stack: ${err.stack}`);
        return apiResponse.sendFailureResponse(
            errorConstants.INTERNAL_SERVER_ERROR,
            err.stack,
        );
    }
};

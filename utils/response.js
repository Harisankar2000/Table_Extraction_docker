module.exports = {
    sendSuccessResponse: ( data, headers) => {
        let response = {
            "statusCode": 200,
            "body" : JSON.stringify(data) || null,
            "headers": {
                "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }
        return response;
    },

    sendFailureResponse: ( error, actualError, statusCode = 500) => {
        let body = {
            "message": error.message,
            "error_code": error.code,
            "error": actualError || ""
        }

        let response = {
            "statusCode": statusCode,
            "body" : JSON.stringify(body) || null,
            "headers": {
                "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
            }
        }

        return response;
    },

    sendHealthCheckResponse: async (event) => {
        const commonConstant = require("../constants/common.constants");
        console.log("event: ", JSON.stringify(event));
        if ( event.headers && event.headers.HealthCheck && event.headers.HealthCheck.toLowerCase() === 'true') {
            console.log("sendHealthCheckSuccessResponse :", commonConstant.healthCheckSuccessMessage);
            data = {
                message: commonConstant.healthCheckSuccessMessage
            }
            let response = {
                "statusCode": 200,
                "body" : JSON.stringify(data) || null,
                "headers": {
                    "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
                }
            }
            return response;
        }
        return false;
    },

    broadCastWebSocketMessage: async (statusCode = 200, data = {}) => {
        return {
            statusCode: statusCode,
            body: JSON.stringify(data)
        };
    },

    broadCastHealthCheckWebSocketMessage: async (event) => {
        const commonConstant = require("../constants/common.constants")
        let queObjJson = JSON.parse(event.body);
        if ( "payload" in queObjJson) {
            let queObj = queObjJson.payload;
            if ( "HealthCheck" in queObj && queObj.HealthCheck.toLowerCase() === 'true') {
                console.log("sendHealthCheckSuccessResponse :", commonConstant.healthCheckSuccessMessage);
                return {
                    statusCode: 200,
                    body: commonConstant.healthCheckSuccessMessage,
                };
            }
        }
        return false;
    }
};
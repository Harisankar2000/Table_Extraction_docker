const error = {
    UNAUTHORIZED: {
        code: '401',
        message: 'unauthorized',
    },
    Invalid_Request_Data: {
        code: '2101',
        message: 'Request field is invalid, missing or not found',
    },
    INTERNAL_SERVER_ERROR: {
        code: '2102',
        message: 'An internal server error occured',
    },
    UPLOAD_FILE_ERROR: {
        code: '2105',
        message: 'Error in uploading file to s3',
    },
    GENERATE_PRESIGNED_URL_ERROR: {
        code: '2106',
        message: 'Error in generating file presigned url',
    },  
    FILE_INSERTION_ERROR: {
        code: '2107',
        message: 'Error while insertion file',
    },
    RECORD_NOT_FOUND: {
        code: '2108',
        message: 'Record not found',
    },
    VALIDATION_ERROR: {
        code: '2109',
        message: 'An validation error occured',
    },
    CONVERSION_ERROR: {
        code: '2110',
        message: 'conversion failed: got empty output',
    },
    DUPLICATE_PROJECT_NAME: {
        code: '2111',
        message: 'Project title already exists - please try with unique title',
    },
    FAILED_TO_UPDATE_RECORD: {
        code: 'FAILED_TO_UPDATE_RECORD',
        message: 'Failed to update record, please try again',
    },
    HIGHLIGHTS_NOT_FOUND: {
        code: 'HIGHLIGHTS_NOT_FOUND',
        message: 'No highlights for this document',
    },
    USER_MAPPING_ERROR: {
        code: 'USER_MAPPING_ERROR',
        message: 'Error while mapping user with project',
    },
    PROJECT_NOT_FOUND_WITH_COMPLETED_STATE: {
        code: 'PROJECT_NOT_FOUND_WITH_COMPLETED_STATE',
        message: 'Project not found with completed state',
    },
    FILTER_LABEL_ALREADY_EXISTS: {
        code: 'FILTER_LABEL_ALREADY_EXISTS',
        message: 'Filter label with same name already exist',
    },
    DOCUMENT_NOT_FOUND: {
        code: 'DOCUMENT_NOT_FOUND',
        message: 'Document not found',
    },
    WS_VALIDATION_ERROR: {
        error: 'Validation Error : Request parameters not found or missing'
    },
    WS_USER_NOT_FOUND: {
        error: 'User not found or not Active'
    },
    WS_DOCUMENT_NOT_FOUND: {
        error: 'Document not found or not Active'
    },
    WS_INTERNAL_SERVER_ERROR: {
        error: 'An internal server error occured',
    }
}

module.exports = error;
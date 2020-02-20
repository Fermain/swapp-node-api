export const authSchema = {
    registerUser: {
        schema: {
            tags: ['Authentication'],
            body: {
                type: 'object',
                    additionalProperties: false,
                    properties: {
                        email_address: { type: 'string' },
                        password: { type: 'string', minLength: 8, maxLength: 16 }
                    },
                required: ['email_address', 'password']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                },
                '4xx': {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'integer' },
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
                '5xx': {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                },
            },
        }
    },
    getToken: {
            schema: {
            tags: ['Authentication'],
                body: {
                type: 'object',
                    additionalProperties: false,
                    properties: {
                    email_address: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['email_address', 'password'],
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' }
                    }
                },
                '4xx': {
                    type: 'object',
                        properties: {
                        statusCode: { type: 'integer' },
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
                '5xx': {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                },
            },
        }
    },
};

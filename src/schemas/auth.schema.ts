export const authSchema = {
    registerUser: {
        schema: {
            tags: ['Authentication'],
            body: {
                type: 'object',
                    additionalProperties: false,
                    properties: {
                        full_name: { type: 'string' },
                        email_address: { type: 'string' },
                        password: { type: 'string', minLength: 8, maxLength: 16 }
                    },
                required: ['email_address', 'full_name', 'password']
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
                500: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'integer' },
                        error: { type: 'string' },
                        message: { type: 'string' },
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
                required: ['username', 'password'],
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
                500: {
                    type: 'object',
                        properties: {
                        statusCode: { type: 'integer' },
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
            },
        }
    },
};

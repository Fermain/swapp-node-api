export const authSchema = {
    auth: {
        url: '/token',
            schema: {
            tags: ['Authentication'],
                body: {
                type: 'object',
                    additionalProperties: false,
                    properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['username', 'password'],
            },
            response: {
                200: {
                    type: 'string',
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
        },
    },

}

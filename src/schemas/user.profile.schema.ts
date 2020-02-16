export const userProfileSchema = {
    createProfile : {
        schema: {
            tags: ['User Profile'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    first_name: { type: 'string' },
                    last_name: { type: 'string' },
                    current_city: { type: 'string' },
                    province: { type: 'string' },
                    bio: { type: 'string' },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        profile_id: { type: 'number' }
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
                        statusCode: {type: 'integer'},
                        error: {type: 'string'},
                        message: {type: 'string'},
                    },
                },
            },
        }
    },
    getUserProfile: {
        schema: {
            tags: ['User Profile'],
            params: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    id: {type: 'number'}
                },
                required: ['id']
            },
            '4xx': {
                type: 'object',
                properties: {
                    statusCode: {type: 'integer'},
                    error: {type: 'string'},
                    message: {type: 'string'},
                },
            },
            500: {
                type: 'object',
                properties: {
                    statusCode: {type: 'integer'},
                    error: {type: 'string'},
                    message: {type: 'string'},
                },
            },
        }
    }
};

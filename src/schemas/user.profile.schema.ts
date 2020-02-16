/**
 * table.increments('id').unsigned().primary();
 table.string('first_name').nullable();
 table.string('last_name').nullable();
 table.string('photo').nullable();
 table.string('current_city').nullable();
 table.string('province').nullable();
 table.text('bio', 'mediumtext').nullable();
 table.integer('user_id').references('id').inTable('users');
 * */

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
                        statusCode: { type: 'integer' },
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
            },
        }
    }
};

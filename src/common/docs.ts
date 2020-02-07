export const swaggerOptions = {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
        info: {
            title: 'Swapp API',
            description: 'Swap API docs',
            version: '0.0.1',
        },
        externalDocs: {
            url: '',
            description: '',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'Authentication', description: 'End-points related to auth' },
        ],
        securityDefinitions: {
            apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header',
            },
        },
    },
};

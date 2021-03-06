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
        host: 'localhost:8000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'Authentication', description: 'End-points related to auth' },
            { name: 'User Profile', description: 'User profile management' },
            {name: 'Products', description: 'Product management calls'}

        ],
        securityDefinitions: {
            Bearer: {
                description: "",
                type: "apiKey",
                name: "Authorization",
                in: "header"
            }
        },
    },
};

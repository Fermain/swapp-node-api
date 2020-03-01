import fs from 'fs';
import fastify from 'fastify';
import JWT from 'fastify-jwt';
import helmet from 'fastify-helmet';
import sensible from 'fastify-sensible';
import rateLimit from 'fastify-rate-limit';
import fastifySwagger from 'fastify-swagger';
import CORS from 'fastify-cors';
import envSchema from 'env-schema';

import {authController} from './conrollers/auth.controller';
import {AuthHandler} from './handlers/auth.handler';
import {swaggerOptions} from './common/docs';
import {userProfileController} from "./conrollers/user.profile.controller";
import {productController} from "./conrollers/product.controller";

const multipart = Symbol('multipart');
const server = fastify({
    logger: true,
    ignoreTrailingSlash: true,
    maxParamLength: 200,
    bodyLimit: 6291456, // 6MB
});
server.register(fastifySwagger, swaggerOptions)
    .ready(err => {
        if (!err) {
            server.swagger();
        }
    });
const schema = {
    type: 'object',
    required: ['JWT_SECRET_KEY', 'PORT'],
    properties: {
        PORT: { type: 'string', default: 8000 },
        JWT_SECRET_KEY: { type: 'string', default: '8EB5E653C3F44EBBA007DD6364F32140' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});

/** register custom controllers */
server.register(authController);
server.register(userProfileController);
server.register(productController);
/***/

/** authentication pre-validation */
server.decorateRequest("currentUser", {});
server.addHook("preValidation", AuthHandler.authInterceptor);
server.addContentTypeParser('multipart', (req, done) => {
    (req as any)[multipart] = true;
    done(null, req);
});
/** authentication pre-validation */

/** middleware */
server.register(rateLimit, {
    max: 100,
    timeWindow: 2000,
    whitelist: ['127.0.0.1', '127.0.0.1:8080'],
});
server.register(helmet, { hidePoweredBy: { setTo: 'Swapp' } });
server.register(JWT, { secret: config.JWT_SECRET_KEY });
server.register(CORS, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
server.register(sensible);
/** middleware */

const start = async () => {
    try {
        const paths = ['./public/products', './public/avatars'];
        if (!fs.existsSync('./public')) {
            fs.mkdirSync('./public');
        }
        for (let child of paths) {
            if (!fs.existsSync(child)) {
                fs.mkdirSync(child);
            }
        }
        await server.listen(config.PORT, '127.0.0.1');
        server.log.info(`server listening on ${config.PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
process.on('uncaughtException', err => {
    console.error(err);
});
process.on('unhandledRejection', err => {
    console.error(err);
});
start();

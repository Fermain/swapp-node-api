import fastify from 'fastify';
import fastifyJWT from 'fastify-jwt';
import helmet from 'fastify-helmet';
import sensible from 'fastify-sensible';
import rateLimit from 'fastify-rate-limit';
import fastifyCORS from 'fastify-cors';

import { authController } from './conrollers/auth.controller';

const server = fastify({
    logger: true,
    caseSensitive: true,
    ignoreTrailingSlash: true,
    maxParamLength: 200,
    bodyLimit: 6291456, // 6MB
});

/** register custom controllers */
server.register(authController);
/***/

/** middleware */
server.register(rateLimit, {
    max: 100,
    timeWindow: 2000,
    whitelist: ['127.0.0.1', '127.0.0.1:8080'],
});
server.register(helmet, { hidePoweredBy: { setTo: 'Mytelnet' } });
server.register(fastifyJWT, { secret: env.AUTH_JWT_PRIVATE_KEY });
server.register(fastifyCORS, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
server.register(sensible);
/** middleware */

const start = async () => {
  try {
    await server.listen(3000);
    server.log.info(`server listening on ${server.server.address()}`)
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

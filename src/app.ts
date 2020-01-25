import fastify from 'fastify';
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

const start = async () => {
  try {
    await server.listen(3000);
    server.log.info(`server listening on ${server.server.address()}`)
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

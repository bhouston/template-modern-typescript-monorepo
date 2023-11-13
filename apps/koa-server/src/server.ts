import 'source-map-support/register.js'; // required for cross platform source map support, other options didn't work across OSes.

import cors from '@koa/cors';
import Router from '@koa/router';
import { toCamelCase } from '@template-typescript-monorepo/common-lib';
import { stringToMd5Hash } from '@template-typescript-monorepo/node-lib';
import fs from 'fs';
import Koa from 'koa';
import compress from 'koa-compress';
import logger from 'koa-logger';
import mount from 'koa-mount';
import proxy from 'koa-proxies';
import send from 'koa-send';
import serve from 'koa-static';
import staticCache from 'koa-static-cache';

import { BASE_DIR, NAME, PORT, VERSION } from './config.js';

const useStaticCache = false;

export const main = async () => {
  console.log(`${NAME}: ${VERSION}`);
  const app = new Koa();
  const router = new Router();

  app.use(logger());
  app.use(cors());
  app.use(
    compress({
      filter() {
        return true;
      }
    })
  );

  router.get('/api/files/images/webp', async (ctx: Koa.Context) => {
    // read file 'test.webp' and then send it back

    console.log('request headers');
    console.log(ctx.request.headers);
    const filePath = `${BASE_DIR}/IrisNebula_NGC7023_2023_v5.png`;
    const readStream = fs.createReadStream(filePath);
    // get file size
    const stats = fs.statSync(filePath);
    ctx.response.set('content-type', 'image/png');
    ctx.response.set('content-length', `${stats.size}`);
    ctx.response.set('cache-control', 'public, max-age=31536000, immutable');
    ctx.response.set('Access-Control-Allow-Origin', '*');
    ctx.response.set('Access-Control-Allow-Credentials', 'true');
    ctx.response.set('Access-Control-Allow-Methods', 'GET,OPTIONS');
    ctx.response.set('content-disposition', 'attachment; filename="test.png"');
    ctx.response.body = readStream;
    ctx.status = 200;
  });

  router.get('/api/get-message', async (ctx: Koa.Context) => {
    const text = toCamelCase('world');
    ctx.response.body = {
      message: text,
      random: stringToMd5Hash(text)
    };
    ctx.response.status = 200;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  if (process.env.NODE_ENV === 'development') {
    const reactApDist = `${BASE_DIR}../react-app/dist`;
    //console.log({ reactApDist });
    if (useStaticCache) {
      app.use(mount('/', staticCache(reactApDist, { maxAge: 60 })));
    } else {
      app.use(
        mount(
          '/',
          serve(reactApDist, {
            index: 'index.html'
          })
        )
      );
    }
    // This will catch all other routes that are not caught by previous middleware
    app.use(async (ctx) => {
      await send(ctx, `${reactApDist}`, {
        root: '/',
        index: 'index.html'
      });
    });
  } else {
    // when in dev proxy to the vite development server
    app.use(
      proxy('/', {
        target: 'http://localhost:4000',
        changeOrigin: true,
        logs: true
      })
    );
  }

  const server = app.listen(PORT, () => {
    console.log(`   Server: http://localhost:${PORT}`);
  });

  let isClosed = false;
  const closeGracefully = async (signal: NodeJS.Signals) => {
    if (isClosed) return;
    console.warn(`Closing as a result of signal: ${signal}.`);
    isClosed = true;
    server.close();
    process.exit(0);
  };

  // handle Ctrl-C, nodemon restart, and Docker stop
  ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'exit'].forEach((signal) => {
    process.on(signal, closeGracefully);
  });
};

main();

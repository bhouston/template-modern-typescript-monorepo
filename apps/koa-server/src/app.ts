import cors from '@koa/cors';
import fs from 'fs';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import compress from 'koa-compress';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';

import { getRouter } from './getRouter.js';
import { config } from './utils/getConfig.js';

export type AppProps = {
  logging: boolean;
};

export const getApp = (appProps: AppProps) => {
  const app = new Koa();

  if (appProps.logging) app.use(logger());

  app.use(cors());
  app.use(
    compress({
      filter() {
        return true;
      },
      br: false // Disable brotli compression
    })
  );

  const router = getRouter(appProps.logging);

  app.use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: path.join(config.BASE_DIR, './tmp'),
        keepExtensions: true // Keep file extension on upload
      }
    })
  );
  app.use(router.routes());
  app.use(router.allowedMethods());

  const nodeEnv = config.NODE_ENV.toLowerCase();
  if (appProps.logging) console.log(`   Mode: ${nodeEnv}`);

  if (nodeEnv === 'production') {
    const reactAppDist = path.join(config.BASE_DIR, '../react-app/dist');

    if (!fs.existsSync(reactAppDist)) {
      // list current directories in ../react-app
      const dirs = fs.readdirSync(path.join(config.BASE_DIR, '../react-app'));
      console.log(
        `The React app build directory does not exist: ${reactAppDist}`
      );
      console.log('Current directories in ../react-app: ', dirs);
      throw new Error(
        `The React app build directory does not exist: ${reactAppDist}`
      );
    }

    // Serve the entire contents of the dist folder
    app.use(
      serve(reactAppDist, {
        setHeaders(res) {
          const url = res.req.url ?? '';
          if (/^\/(static|assets)\//.test(url)) {
            // Set cache headers for immutable files
            res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for one year
          }
        }
      })
    );

    // Catch-all route to serve the index.html file for non-static requests
    app.use(async (ctx, next) => {
      if (!ctx.path.startsWith('/api')) {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(path.join(reactAppDist, 'index.html'));
      }
      await next();
    });
  }

  return app;
};

export const getTestApp = () => {
  return getApp({
    logging: false
  });
};

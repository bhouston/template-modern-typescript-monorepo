FROM oven/bun:latest

WORKDIR /usr/src/app

COPY . ./

RUN bun install --silent
RUN bunx nx run-many -t build -p koa-server react-app

ENV PORT=8080
EXPOSE 8080
CMD ["bun", "./apps/koa-server/dist/server.js"]

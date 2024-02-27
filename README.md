# TypeScript + React App Mono Repository

This is a template for a monorepo that uses best practices for TypeScript, Web Services and React.

It is what @bhouston considers best practice in February 2024.

## The end result

![Screenshot 2024-02-27 at 9 25 01 AM](https://github.com/bhouston/template-typescript-monorepo/assets/588541/8ee26d8e-8451-4257-935a-094bcab749cd)

## Features

- Bun runtime for maximum speed.
- Mono-repository using NPM workspaces
- TypeScript for type safety
- ES Modules for fast builds
- NodeNext node resolution
- React for UI
- Both react and vanilla JS libraries
- Command line, React app, and web server
- Vite for Bundling, CSS Handling, Live Reloading.
- Hot reload of React
- Auto service restart for the web server
- Lerna for managing the monorepo dependencies in parallel builds
- Prettier for code formatting
- ESLint for linting
- Incremental and caching builds via NX.
- VSCode will auto-format on save and paste.
- Jest testing
- Github action CI

## Getting Started

1. Clone this repository
2. Run `bun install`

### Tests

1. Run `bun run test` to run all jest tests

### Continuous Dev Build

1. Run `bun run watch` to start the hot reload development server & build watchers

### Optimized Production Build

1. Run `bun run build` to build the source

### Run the webserver (no reload)

1. Run `bunx koa-server` to start the webserver
2. Open `http://localhost:8000` in your browser

### Command Line

1. Run `bunx cmdline-app` to run the CLI example

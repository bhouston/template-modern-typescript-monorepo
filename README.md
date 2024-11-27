# TypeScript + React App Mono Repository

This is a template for a monorepo that uses best practices for TypeScript, Web Services and React.

It is what @bhouston considers best practice in November 2024.

## The end result

<img width="573" alt="Screenshot 2024-01-09 at 4 53 45 PM" src="https://github.com/bhouston/template-typescript-monorepo/assets/588541/3a7e6b62-ff16-492d-9f20-b409ab84f104">

## Features

- Mono-repository using NPM workspaces
- TypeScript for type safety
- ES Modules for fast builds
- NodeNext node resolution
- React for UI
- Tailwindcss for styling
- Both react and vanilla JS libraries
- Command line, React app, and web server
- Vite for Bundling, CSS Handling, Live Reloading.
- Remix for router, SSR
- Fastify for server with file-based router
- Hot reload of React
- Auto service restart for the web server\*
- NX for managing the monorepo dependencies in parallel builds
- Prettier for code formatting
- ESLint for linting
- Incremental and caching builds via NX.
- VSCode will auto-format on save and paste.
- Node:test testing
- Github action CI

\* Temporarily disabled with move to Fastify.

## Getting Started

1. Clone this repository
2. Run `npm install`

### Tests

1. Run `npm run test` to run all tests

### Continuous Dev Build

1. Run `npm run dev` to start the hot reload development server & build watchers

### Optimized Production Build

1. Run `npm run build` to build the source

### Command Line

1. Run `npx cmdline-app` to run the CLI example

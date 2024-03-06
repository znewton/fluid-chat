# fluid-chat

A chat app built on fluid. Useful for testing various scenarios like op and summary size and connect/disconnect flow.

**Do not deploy** as a production application. This is very much a development and validation tool. Deployment of the app as-is would expose secrets, and there is no user authentication.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (using [NVM](https://github.com/nvm-sh/nvm) recommended)
- [Yarn](https://yarnpkg.com/) (recommend using `corepack enable` to install yarn globally without npm)

### Install Dependencies

Install JS package dependencies.

```shell
yarn
```

### Run - Local

Run the app against a local Fluid service (like Routerlicious).

1. Copy `src/config/config.example.ts` to a new file `src/config/config.ts`. (`cp src/config/config.example.ts src/config/config.ts`)
2. Run `yarn start`, then open the app at http://localhost:1234

As shell commands:

```shell
cp src/config/config.example.ts src/config/config.ts
yarn start
```

### Run - Remote

Run the app against a remote Fluid service (like Azure Fluid Relay).

1. Update the new `config.ts` to export your service connection secrets. This file is gitignored so it will not be committed.
2. Run `yarn start:remote`, then open the app at http://localhost:1234

I recommend setting up your `config.ts` file like this:

```typescript
import { IServiceConfig } from "../definitions";

const exampleConfig: IServiceConfig = {
    serviceEndpoint: "http://fluidrelay.azure.com",
    tenantId: "some-tenant-id-string",
    tenantKey: "some-tenant-key-string",
};
const example2Config: IServiceConfig = {
    serviceEndpoint: "http://fluidrelay.azure.com",
    tenantId: "some-tenant-id-string",
    tenantKey: "some-tenant-key-string",
};

const defaultConfig = exampleConfig;

export const config = (() => {
    const env = process.env.ENV;
    console.log("Using env: ", env);
    switch (env) {
        case "example":
            return exampleConfig;
        case "example2":
            return example2Config;
        default:
            return defaultConfig;
    }
})();
```

When set up in this way, you can add many different service configurations and switch between them by setting the `ENV` environment variable. For example,

```shell
ENV=example2 yarn start:remote
```

## Troubleshooting

Most problems with running Fluid Chat can be quickly resolved by removing the [Parcel](https://parceljs.org/) cache. This is especially true when switching between local and remote services, or after pulling the latest Git repo changes.

```shell
# Delete cached/temp files
yarn clean
# Make sure dependencies are up to date
yarn
# Start the app
ENV=example2 yarn start:remote
```

## Using the App

- Opening a new window at http://localhost:1234/ will create a new chat session (i.e. document)
- Opening a new window at http://localhost:1234/#existing-document-id will open an existing chat session (i.e. document)
- View the "Help" dialogue when opening a new chat session (i.e. document), or any time from the "?" button at the top left.

## Validate local `routerlicious-driver` changes

1. Build your local FluidFramework repo (`cd /path/to/FluidFramework && npm install && npm run build:fast`)
2. Add the following to the `resolutions` field of the `package.json`, replacing `/path/to/FluidFramework` with your local FluidFramework repo (e.g `/Users/username/code/FluidFramework`):
```
"@fluidframework/routerlicious-driver": "file:/path/to/FluidFramework/packages/drivers/routerlicious-driver",
"@fluidframework/driver-base": "file:/path/to/FluidFramework/packages/drivers/driver-base",
"@fluidframework/driver-definitions": "file:/path/to/FluidFramework/packages/common/driver-definitions",
"@fluidframework/core-interfaces": "file:/path/to/FluidFramework/packages/common/core-interfaces",
"@fluidframework/driver-utils": "file:/path/to/FluidFramework/packages/loader/driver-utils",
"@fluidframework/telemetry-utils": "file:/path/to/FluidFramework/packages/utils/telemetry-utils"
```
3. `yarn install`

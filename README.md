# fluid-chat

A chat app built on fluid. Useful for testing various scenarios like op and summary size and connect/disconnect flow.

**Do not deploy** as a production application. This is very much a development and validation tool. Deployment of the app as-is would expose secrets, and there is no user authentication.

## Getting Started - Local

Run the app against a local Fluid service (like Routerlicious).

1. Run `yarn start`
2. Copy `src/config.example.ts` to a new file `src/config.ts`.

## Getting Started - Remote

Run the app against a remote Fluid service (like Azure Fluid Relay).

1. Update the new `config.ts` to export your service connection secrets. This file is gitignored so it will not be committed.
2. Run `yarn start:remote`, then open the app at http://localhost:1234

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

/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { generateUser } from "@fluidframework/server-services-client";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { AzureClient, AzureLocalConnectionConfig, AzureRemoteConnectionConfig } from "@fluidframework/azure-client";

const dev0Config = {
    serviceEndpoint: "https://dev0.us.frs.azure.com",
    tenantId: "znewton-summary-2",
    tenantKey: "7c4ac3bab9db4ca6b2a0b27de5d1cc44",
};

// This function will determine if local or remote mode is required (based on FLUID_CLIENT),
// and return a new AzureClient instance based on the mode by setting the Connection config
// accordingly.
export function createAzureClient(userID?: string, userName?: string): AzureClient {
    // const localConnectionProps: AzureLocalConnectionConfig = {
    //     type: "local",
    //     endpoint: "http://localhost:7070",
    //     tokenProvider: new InsecureTokenProvider("alshdfladkfjvh", generateUser()),
    // };
    // return new AzureClient({
    //     connection: localConnectionProps
    // })

    // use AzureClient remote mode will run against live Azure Fluid Relay.
    // Default to running Tinylicious for PR validation
    // and local testing so it's not hindered by service availability
    const connectionProps: AzureRemoteConnectionConfig | AzureLocalConnectionConfig = {
        tenantId: dev0Config.tenantId,
        tokenProvider: new InsecureTokenProvider(dev0Config.tenantKey, generateUser()),
        endpoint: dev0Config.serviceEndpoint,
        type: "remote",
    };
    return new AzureClient({ connection: connectionProps });
}

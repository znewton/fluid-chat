import { IServiceConfig } from "../definitions";

const exampleConfig: IServiceConfig = {
    serviceEndpoint: "http://fluidrelay.azure.com",
    tenantId: "some-tenant-id-string",
    tenantKey: "some-tenant-key-string",
};

export const config = exampleConfig;
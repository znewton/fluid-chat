import { IServiceConfig } from "../definitions";

const exampleConfig: IServiceConfig = {
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
        default:
            return defaultConfig;
    }
})();

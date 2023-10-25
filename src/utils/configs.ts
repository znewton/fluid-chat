import { IServiceConfig } from "../definitions";

export async function getServiceConfig(): Promise<IServiceConfig> {
    if (process.env.FLUID_CONFIG === "local") {
        console.log("Using local connection configs");
        return {
            tenantId: "fluid",
            tenantKey: "create-new-tenants-if-going-to-production",
            serviceEndpoint: "http://localhost:3003",
        };
    }
    const { config } = await import("../config/config");
    return { ...config };
};

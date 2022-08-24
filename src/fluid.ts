import { AzureClient, AzureRemoteConnectionConfig } from "@fluidframework/azure-client";
import { ContainerSchema, IFluidContainer, SharedMap } from "fluid-framework";
import { v4 as uuid } from "uuid";
import { contentKey, initialPayloadKey, IPlainMessage, IPointerMessage, IUser, Messages, messagesKey } from "./definitions";
import { CustomInsecureTokenProvider, Kilobyte, randomString } from "./utils";

export const getFluidData = async (username?: string) => {
    const { tenantId, tenantKey, endpoint } = await (async () => {
        if (process.env.FLUID_CONFIG === "local") {
            console.log("Using local connection configs");
            return {
                tenantId: "fluid",
                tenantKey: "create-new-tenants-if-going-to-production",
                endpoint: "http://localhost:3003",
            };
        }
        const { config } = await import("./config/config");
        return {
            tenantId: config.tenantId,
            tenantKey: config.tenantKey,
            endpoint: config.serviceEndpoint,
        };
    })();
    const userId = username ?? uuid();
    console.log({ tenantId, tenantKey, endpoint, userId })
    const client = new AzureClient({
        connection: {
            type: "remote",
            endpoint: endpoint,
            tokenProvider: new CustomInsecureTokenProvider(tenantKey, { id: userId }),
            tenantId: tenantId,
        } as AzureRemoteConnectionConfig,
    });
    const containerSchema: ContainerSchema = {
        initialObjects: { map: SharedMap, hiddenData: SharedMap },
        dynamicObjectTypes: [SharedMap],
    };
    let container: IFluidContainer;
    const containerId = location.hash.substring(1);
    console.time("disconnected");
    if (!containerId) {
        ({ container } = await client.createContainer(containerSchema));
        const map: SharedMap = (container.initialObjects.map as SharedMap);
        map.set(messagesKey, []);
        if (window.location.search.includes(initialPayloadKey)) {
            const hiddenData: SharedMap = (container.initialObjects.hiddenData as SharedMap);
            hiddenData.set(initialPayloadKey, `${randomString().repeat(Kilobyte * Kilobyte)}`); // 10Mb initial payload size
        }
        const id = await container.attach();
        location.hash = id;
    } else {
        ({ container } = await client.getContainer(containerId, containerSchema));
    }
    return { container, user: { id: userId, temp: username === undefined } };
};

const getMessages = (container: IFluidContainer): Messages => {
    const map = container.initialObjects.map as SharedMap;
    return map.get(messagesKey) ?? [];
}
export const createAndSetPointerMessage = async (container: IFluidContainer, user: IUser, messageContent: string): Promise<IPointerMessage> => {
    const map = container.initialObjects.map as SharedMap;
    const messages = getMessages(container);
    const sharedMap = await container.create(SharedMap);
    sharedMap.set(contentKey, messageContent);
    const message: IPointerMessage = {
        id: uuid(),
        handle: sharedMap.handle,
        sender: user.id,
        type: "plain-large",
    };
    messages.push(message);
    map.set(messagesKey, messages);
    return message;
};
export const createAndSetPlainMessage = (container: IFluidContainer, user: IUser, messageContent: string): IPlainMessage => {
    const map = container.initialObjects.map as SharedMap;
    const messages = getMessages(container);
    const message: IPlainMessage = {
        id: uuid(),
        sender: user.id,
        type: "plain",
        content: messageContent,
    };
    messages.push(message);
    map.set(messagesKey, messages);
    return message;
};

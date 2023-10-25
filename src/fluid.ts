import { AzureClient, AzureContainerServices, AzureRemoteConnectionConfig, AzureUser } from "@fluidframework/azure-client";
import { ContainerSchema, IFluidContainer, SharedMap } from "fluid-framework";
import { v4 as uuid } from "uuid";
import { IFluidDocument, IPlainMessage, IPointerMessage, IUser, Messages, QueryStringKeys, SharedMapKeys } from "./definitions";
import { CustomInsecureTokenProvider, Kilobyte, randomString, getServiceConfig } from "./utils";

/**
 * Create an AzureClient instance with configured service endpoint and credentials.
 */
const getAzureClient = async (user?: IUser): Promise<AzureClient> => {
    const azureUser: AzureUser<IUser> = {
        name: user.id,
        id: user.id,
        additionalDetails: user,
    };
    const { tenantId, tenantKey, serviceEndpoint: endpoint } = await getServiceConfig();
    console.log({ tenantId, tenantKey, endpoint, user })
    const client = new AzureClient({
        connection: {
            type: "remote",
            endpoint: endpoint,
            tokenProvider: new CustomInsecureTokenProvider(tenantKey, azureUser),
            tenantId: tenantId,
        } as AzureRemoteConnectionConfig,
    });
    return client;
};

/**
 * Creates an AzureClient instance, then uses that to create a new attached container or get an existing container.
 * Before attaching a new container, it will first add 3 new "pointer" messages to the initial "map" SharedMap object while detached.
 */
export const getFluidData = async (documentId: string | undefined, user: IUser): Promise<IFluidDocument> => {
    const client = await getAzureClient(user);
    const containerSchema: ContainerSchema = {
        initialObjects: { map: SharedMap, hiddenData: SharedMap },
        dynamicObjectTypes: [SharedMap],
    };
    let container: IFluidContainer;
    let services: AzureContainerServices;
    let id: string = documentId;
    console.time("disconnected");
    if (!id) {
        ({ container, services } = await client.createContainer(containerSchema));
        const map: SharedMap = (container.initialObjects.map as SharedMap);
        map.set(SharedMapKeys.messages, []);
        if (window.location.search.includes(QueryStringKeys.initialPayload)) {
            const hiddenData: SharedMap = (container.initialObjects.hiddenData as SharedMap);
            hiddenData.set(QueryStringKeys.initialPayload, `${randomString().repeat(Kilobyte * Kilobyte)}`); // 10Mb initial payload size
        }
        await Promise.all([
            createAndSetPointerMessage(container, { id: "test-user", temp: true, permissions: ["read", "write"] }, "test message"),
            createAndSetPointerMessage(container, { id: "test-user", temp: true, permissions: ["read", "write"] }, "test message"),
            createAndSetPointerMessage(container, { id: "test-user", temp: true, permissions: ["read", "write"] }, "test message"),
        ]);
        
        id = await container.attach();
        console.log("attached container", id);
    } else {
        ({ container, services } = await client.getContainer(id, containerSchema));
    }
    return { container, services, id };
};

/**
 * Retrieve all messages from the initial "map" SharedMap object.
 */
const getMessages = (container: IFluidContainer): Messages => {
    const map = container.initialObjects.map as SharedMap;
    return map.get(SharedMapKeys.messages) ?? [];
}
/**
 * Creates an {@link IPlainMessage} message in a new SharedMap which is then pointed to by the initial "map" SharedMap object.
 * This is useful for sending large messages, because it will be in its own DO, which will not meaningfully increase the size of the initial SharedMap DO.
 */
export const createAndSetPointerMessage = async (container: IFluidContainer, user: IUser, messageContent: string): Promise<IPointerMessage> => {
    const map = container.initialObjects.map as SharedMap;
    const messages = getMessages(container);
    const sharedMap = await container.create(SharedMap);
    sharedMap.set(SharedMapKeys.content, messageContent);
    const message: IPointerMessage = {
        id: uuid(),
        handle: sharedMap.handle,
        sender: user.id,
        type: "plain-large",
    };
    messages.push(message);
    map.set(SharedMapKeys.messages, messages);
    return message;
};
/**
 * Creates an {@link IPlainMessage} message on the initial "map" SharedMap object.
 * Be careful setting this to a large message, because it will continue to increase the same DO, which could then eventually cause the DO to be too large.
 */
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
    map.set(SharedMapKeys.messages, messages);
    return message;
};

import { IFluidContainer, SharedMap } from "fluid-framework";

export const initialPayloadKey = "initialpayload";
export const messagesKey = "messages";
export const contentKey = "content";

export type Theme = "dark" | "light";

export interface IFluidDocument {
    container: IFluidContainer;
    id: string;
}

export interface IMessage {
    id: string;
    type: "plain" | "plain-large";
    sender: string;
}
/**
 * Message contents stored directly in object within messages array.
 */
export interface IPlainMessage extends IMessage {
    type: "plain";
    content: string;
}
/**
 * Pointer to message contents stored in map key-value or other DDS.
 */
export interface IPointerMessage extends IMessage {
    type: "plain-large";
    handle: SharedMap["handle"];
}
export type Messages = (IPlainMessage | IPointerMessage)[];
export interface IUser {
    id: string;
    temp: boolean;
    permissions: ("read" | "write")[];
}

export interface IServiceConfig {
    serviceEndpoint: string;
    tenantId: string;
    tenantKey: string;
}

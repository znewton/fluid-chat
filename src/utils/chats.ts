import { getServiceConfig } from "./configs";
import { StorageKeys } from "./localStorage";

export interface IChat {
	/**
	 * Fluid Document ID.
	 */
	id: string;
	/**
	 * Milliseconds since Epoch.
	 */
	creationDatetime: number;
	/**
	 * Milliseconds since Epoch.
	 */
	lastOpenedDatetime: number;
}

function getChatListKey(tenantId: string): string {
	return `${StorageKeys.chats}:${tenantId}`;
}

async function getChatMapFromLocalStorage(): Promise<{
	tenantId: string;
	chatMap: Record<string, IChat>;
}> {
	const { tenantId } = await getServiceConfig();
	const storageKey = getChatListKey(tenantId);
	const chatListString = localStorage.getItem(storageKey);
	const chatMap: Record<string, IChat> = chatListString
		? JSON.parse(chatListString)
		: {};
	return { tenantId, chatMap };
}

export async function getChatList(): Promise<IChat[]> {
	const { chatMap } = await getChatMapFromLocalStorage();
	return Object.values(chatMap);
}

export async function updateChatList(newChatId: string): Promise<IChat[]> {
	if (newChatId) {
		const { tenantId, chatMap } = await getChatMapFromLocalStorage();
		if (!chatMap[newChatId]) {
			chatMap[newChatId] = {
				id: newChatId,
				creationDatetime: Date.now(),
				lastOpenedDatetime: Date.now(),
			};
		} else {
			chatMap[newChatId] = {
				...chatMap[newChatId],
				lastOpenedDatetime: Date.now(),
			};
		}
		const storageKey = getChatListKey(tenantId);
		localStorage.setItem(storageKey, JSON.stringify(chatMap));
	}
	return getChatList();
}

export async function clearChatList(): Promise<IChat[]> {
	const { tenantId } = await getServiceConfig();
	const storageKey = getChatListKey(tenantId);
	localStorage.setItem(storageKey, JSON.stringify({}));
	return [];
}

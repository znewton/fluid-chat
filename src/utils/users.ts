import {uniqueNamesGenerator, adjectives, colors, animals} from "unique-names-generator";
import { IUser } from "../definitions";
import { localStorageManager, userKey } from "./localStorage";

const genUserId = (): string => {
    return uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: "-" });
};

const randomUsers: IUser[] = [];
export const getRandomUser = (currentUser: IUser): IUser => {
    const possibleUsers = [
        ...randomUsers,
        // ~50% chance to send message from current user
        ...Array(randomUsers.length + 1).fill(currentUser)];
    const userIndex = Math.floor(Math.random() * (possibleUsers.length + 1));
    const existingUser: IUser | undefined = possibleUsers[userIndex];
    const user: IUser = existingUser ?? { id: genUserId(), temp: true, permissions: [] };
    if (!existingUser) {
        randomUsers.push(user);
    }
    return user;
};

export const canWrite = (user: IUser): boolean => user.permissions.includes("write");

class CurrentUserStore {
    public setCurrentUser(user: IUser) {
        localStorageManager.set(userKey, JSON.stringify(user));
    }
    public getCurrentUser(): IUser | undefined {
        try {
            const user = JSON.parse(localStorageManager.get(userKey) ?? "");
            return user || undefined;
        } catch {
            return undefined;
        }
    }
    public clearCurrentUser() {
        localStorageManager.delete(userKey);
    }
}
export const userStore = new CurrentUserStore();

export const getCurrentUser = (): IUser => {
    const currentUser = userStore.getCurrentUser();
    if (currentUser === undefined) {
        const name = genUserId();
        const newTempUser: IUser = {
            id: name,
            temp: true,
            permissions: ["read", "write"],
        }
        userStore.setCurrentUser(newTempUser);
        return newTempUser;
    }
    return currentUser;
}

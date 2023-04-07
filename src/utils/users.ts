import { v4 as uuid } from "uuid";
import { IUser } from "../definitions";
import { localStorageManager, usernameKey } from "./localStorage";

const randomUsers: IUser[] = [];
export const getRandomUser = (currentUser: IUser): IUser => {
    const possibleUsers = [
        ...randomUsers,
        // ~50% chance to send message from current user
        ...Array(randomUsers.length + 1).fill(currentUser)];
    const userIndex = Math.floor(Math.random() * (possibleUsers.length + 1));
    const existingUser: IUser | undefined = possibleUsers[userIndex];
    const user: IUser = existingUser ?? { id: uuid(), temp: true, permissions: [] };
    if (!existingUser) {
        randomUsers.push(user);
    }
    return user;
};

export const getCurrentUser = (): IUser => {
    const loggedInUsername = localStorageManager.get(usernameKey);
    if (loggedInUsername === undefined) {
        return {
            id: uuid(),
            temp: true,
            permissions: ["read", "write"],
        };
    }
    if (loggedInUsername === "reader") {
        return {
            id: loggedInUsername,
            temp: false,
            permissions: ["read"],
        };
    }
    return {
        id: loggedInUsername,
        temp: false,
        permissions: ["read", "write"],
    };
}

export const canWrite = (user: IUser): boolean => user.permissions.includes("write");

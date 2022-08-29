import { v4 as uuid } from "uuid";
import { IUser } from "../definitions";
import { localStorageManager, usernameKey } from "./localStorage";

export const getUser = (): IUser => {
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
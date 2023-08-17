import {uniqueNamesGenerator, adjectives, colors, animals} from "unique-names-generator";
import { IUser } from "../definitions";

export const genUserId = (): string => {
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

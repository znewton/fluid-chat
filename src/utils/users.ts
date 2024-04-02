import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from "unique-names-generator";
import type { IFluidChatUser } from "../definitions";

export const genUserId = (): string => {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: "-",
	});
};

const randomUsers: IFluidChatUser[] = [];
export const getRandomUser = (currentUser: IFluidChatUser): IFluidChatUser => {
	const possibleUsers = [
		...randomUsers,
		// ~50% chance to send message from current user
		...Array(randomUsers.length + 1).fill(currentUser),
	];
	const userIndex = Math.floor(Math.random() * (possibleUsers.length + 1));
	const existingUser: IFluidChatUser | undefined = possibleUsers[userIndex];
	const user: IFluidChatUser = existingUser ?? {
		id: genUserId(),
		temp: true,
		permissions: [],
	};
	if (!existingUser) {
		randomUsers.push(user);
	}
	return user;
};

export const canWrite = (user: IFluidChatUser | undefined): boolean =>
	user?.permissions.includes("write") ?? false;

import React from "react";
import { LoremIpsum } from "lorem-ipsum";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IFluidContainer } from "fluid-framework";
import { IUser } from "../definitions";
import { createAndSetPlainMessage } from "../fluid";
import { canWrite } from "../utils";

const genChatUsers: IUser[] = [];

export interface IGenChatButtonProps {
    currentUser: IUser;
    container: IFluidContainer;
}

export const GenChatButton: React.FunctionComponent<IGenChatButtonProps> = (props) => {
    const handleGenChat: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        // Generate user
        const possibleUsers = [
            ...genChatUsers,
            // ~50% chance to send message from current user
            ...Array(genChatUsers.length + 1).fill(props.currentUser)];
        const userIndex = Math.floor(Math.random() * (possibleUsers.length + 1));
        const existingUser: IUser | undefined = possibleUsers[userIndex];
        const user: IUser = existingUser ?? { id: uuid(), temp: true, permissions: [] };
        if (!existingUser) {
            genChatUsers.push(user);
        }
        // Generate message
        const loremIpsum = new LoremIpsum();
        const sentenceCount = Math.floor(Math.random() * 3);
        const wordCount = Math.floor(Math.random() * 5);
        const message = sentenceCount ? loremIpsum.generateSentences(sentenceCount) : loremIpsum.generateWords(wordCount);
        // Send message
        createAndSetPlainMessage(props.container, user, message);
    };

    const disableInputs = !canWrite(props.currentUser);

    return (
        <button type="button" onClick={handleGenChat} disabled={disableInputs}>
            <FontAwesomeIcon icon={["fas", "shuffle"]} title="send random message" />
            &nbsp;&nbsp;Gen Chat
        </button>
    );
}
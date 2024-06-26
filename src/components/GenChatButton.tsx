import type React from "react";
import type { IFluidContainer } from "@fluidframework/fluid-static";
import { RiShuffleFill } from "react-icons/ri";
import type { IFluidChatUser } from "../definitions";
import { createAndSetPlainMessage } from "../fluid";
import { canWrite, generateLoremIpsumMessage, getRandomUser } from "../utils";

export interface IGenChatButtonProps {
	currentUser: IFluidChatUser;
	container: IFluidContainer | undefined;
}

export const GenChatButton: React.FunctionComponent<IGenChatButtonProps> = (
	props,
) => {
	const handleGenChat: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		if (!props.container) return;
		// Generate user
		const user = getRandomUser(props.currentUser);
		// Generate message
		const message = generateLoremIpsumMessage();
		// Send message
		createAndSetPlainMessage(props.container, user, message);
	};

	const disableInputs = !canWrite(props.currentUser);

	return (
		<button type="button" onClick={handleGenChat} disabled={disableInputs}>
			<RiShuffleFill />
			&nbsp;&nbsp;Gen Chat
		</button>
	);
};

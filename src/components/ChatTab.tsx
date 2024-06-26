import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { MessagesDisplay } from "./MessageDisplay";
import { MessageForm } from "./MessageForm";
import { AudienceDisplay } from "./AudienceDisplay";
import type { IFluidDocument, IFluidChatUser } from "../definitions";
import { getFluidData } from "../fluid";
import { genUserId } from "../utils";
import { ConnectionTimer } from "./ConnectionTimer";
import { ReactionMenu } from "./Reactions";
import { NotificationDisplay } from "./NotificationDisplay";

export interface IChatTabProps {
	documentId: string | undefined;
	readonly?: boolean;
	onDocumentIdChange: (id: string) => void;
	onCloseClient?: () => void;
}

export const ChatTab: React.FunctionComponent<IChatTabProps> = (
	props: IChatTabProps,
) => {
	const [document, setDocument] = React.useState<IFluidDocument>();
	const user: IFluidChatUser = React.useMemo(
		() => ({
			id: genUserId(),
			temp: true,
			permissions: props.readonly ? ["read"] : ["read", "write"],
		}),
		[props.readonly],
	);
	React.useEffect(() => {
		if (document) {
			if (document?.id === props.documentId) {
				return;
			}
			console.log("new container detected, disposing old one", {
				old: document?.id,
				new: props.documentId,
			});
			// DocId changed. Dispose old container before creating new one.
			document?.container.dispose();
		}
		console.log("Connecting User:", user);
		let doc: IFluidDocument | undefined;
		getFluidData(props.documentId, user).then((fluidDocument) => {
			setDocument(fluidDocument);
			doc = fluidDocument;
			if (fluidDocument?.id !== props.documentId) {
				props.onDocumentIdChange?.(fluidDocument.id);
			}
		});
	}, [props.documentId, user, document, props.onDocumentIdChange]);

	const closeClient = React.useCallback(() => {
		document?.container.dispose();
		props.onCloseClient?.();
	}, [props.onCloseClient, document]);

	return (
		<div className="chat">
			<nav className="toolbar">
				<AudienceDisplay
					audience={document?.services?.audience}
					currentUser={user}
				/>
				<div className="flex-row">
					<ConnectionTimer container={document?.container} />
					<button type="button" onClick={closeClient} title="Close Client">
						<RiCloseFill />
					</button>
				</div>
			</nav>
			<MessagesDisplay container={document?.container} user={user} />
			<NotificationDisplay container={document?.container} user={user} />
			<ReactionMenu container={document?.container} user={user} />
			<MessageForm container={document?.container} user={user} />
		</div>
	);
};

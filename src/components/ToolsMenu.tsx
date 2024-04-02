import type React from "react";
import {
	RiBookFill,
	RiDoorOpenFill,
	RiKey2Fill,
	RiMailSendFill,
	RiUpload2Fill,
	RiWifiOffFill,
} from "react-icons/ri";
import { createAndSetPointerMessage } from "../fluid";
import {
	accessibleClickHandler,
	canWrite,
	generateLargeMessage,
	localStorageManager,
	StorageKeys,
} from "../utils";
import type { IMessageFormProps } from "./MessageForm";

interface ISendLargeMessageToolProps extends IMessageFormProps {
	sizeKb: number;
	extraDescription?: string;
}
const SendLargeMessageTool: React.FunctionComponent<
	ISendLargeMessageToolProps
> = (props) => {
	const disabled = !canWrite(props.user);
	const handleClick = accessibleClickHandler(() => {
		if (disabled || !props.container) return;
		createAndSetPointerMessage(
			props.container,
			props.user,
			generateLargeMessage(props.sizeKb),
		);
	});

	return (
		<li onClick={handleClick} onKeyUp={handleClick} data-disabled={disabled}>
			<p>
				<span className="menu-icon">
					<RiMailSendFill />
				</span>
				<strong>Send {props.sizeKb}Kb Message</strong>
			</p>
			<p>
				Send a {props.sizeKb}Kb message as an individual SharedMap DDS.{" "}
				{props.extraDescription ?? ""}
			</p>
		</li>
	);
};

interface ISendLargeMessagesToolProps extends IMessageFormProps {
	sizeKb: number;
	count: number;
}
const SendLargeMessagesTool: React.FunctionComponent<
	ISendLargeMessagesToolProps
> = (props) => {
	const disabled = !canWrite(props.user);
	const handleClick = accessibleClickHandler(() => {
		if (disabled || !props.container) return;
		const messageContents: string[] = [];
		for (let i = 0; i < props.count; i++) {
			messageContents.push(`${i + 1} - ${generateLargeMessage(props.sizeKb)}`);
		}
		for (const messageContent of messageContents) {
			createAndSetPointerMessage(props.container, props.user, messageContent);
		}
	});

	return (
		<li onClick={handleClick} onKeyUp={handleClick} data-disabled={disabled}>
			<p>
				<span className="menu-icon">
					<RiMailSendFill />
				</span>
				<strong>
					Send {props.count}x {props.sizeKb}Kb Messages
				</strong>
			</p>
			<p>
				Send {props.count}, {props.sizeKb}kb messages as individual SharedMap
				DDS's in quick succession. Useful for triggering a bug where message
				size exceeds Socket.io's maxHttpBufferSize of 1Mb, even though it is
				multiple ops.
			</p>
		</li>
	);
};

export interface IToolsMenuProps extends IMessageFormProps {}
export const ToolsMenu: React.FunctionComponent<IToolsMenuProps> = (
	props: IToolsMenuProps,
) => {
	const handleDisconnect = accessibleClickHandler(() => {
		console.log("-- disconnecting from document --");
		props.container?.disconnect();
	});
	const handleLeave = accessibleClickHandler(() => {
		console.log("Leaving...");
		props.container?.dispose();
	});
	const configuredTokenLifetime: string | undefined = localStorageManager.get(
		StorageKeys.tokenLifetime,
	);
	const handleToggleTokenLifetimeReduction = accessibleClickHandler(() => {
		if (configuredTokenLifetime !== undefined) {
			localStorageManager.delete(StorageKeys.tokenLifetime);
		} else {
			localStorageManager.set(
				StorageKeys.tokenLifetime,
				`${45 * 1000}` /* 45 seconds in milliseconds */,
			);
		}
		window.location.reload();
	});
	const handleCreateNewSessionWithHeavyPayload = accessibleClickHandler(() => {
		window.location.assign("/?initialpayload");
	});
	const handleCreateNewReadOnlySession = accessibleClickHandler(() => {
		window.location.assign("/?readonly");
	});
	return (
		<ul className="tools-menu" role="menu">
			<li onClick={handleDisconnect} onKeyUp={handleDisconnect}>
				<p>
					<span className="menu-icon">
						<RiWifiOffFill />
					</span>
					<strong>Disconnect</strong>
				</p>
				<p>
					Disconnect from session without destroying container. Reconnect by
					sending a message or pressing "Enter" in the message input area.
				</p>
			</li>
			<li onClick={handleLeave} onKeyUp={handleLeave}>
				<p>
					<span className="menu-icon">
						<RiDoorOpenFill />
					</span>
					<strong>Leave</strong>
				</p>
				<p>
					Disconnect from session and dispose of container completely. Requires
					page refresh to reconnect.
				</p>
			</li>
			<li
				onClick={handleCreateNewReadOnlySession}
				onKeyUp={handleCreateNewReadOnlySession}
			>
				<p>
					<span className="menu-icon">
						<RiBookFill />
					</span>
					<strong>Create New Read Only Session</strong>
				</p>
				<p>Opens a new chat session (document) where all users are readers.</p>
			</li>
			<li
				onClick={handleCreateNewSessionWithHeavyPayload}
				onKeyUp={handleCreateNewSessionWithHeavyPayload}
			>
				<p>
					<span className="menu-icon">
						<RiUpload2Fill />
					</span>
					<strong>Create New Session with 10Mb Initial Payload</strong>
				</p>
				<p>
					Opens a new chat session (document) with a hidden payload of 10Mb.
					This is useful for debugging issues or checking performance with large
					initial summary sizes being sent to Alfred.
				</p>
			</li>
			<li
				onClick={handleToggleTokenLifetimeReduction}
				onKeyUp={handleToggleTokenLifetimeReduction}
			>
				<p>
					<span className="menu-icon">
						<RiKey2Fill />
					</span>
					<strong>
						{configuredTokenLifetime !== undefined
							? "Reset Token Lifetime to Default (1hr)"
							: "Reduce Token Lifetime to 45 Seconds"}
					</strong>
				</p>
				<p>
					{configuredTokenLifetime !== undefined
						? `Token lifetime is currently shortened to ${Math.round(
								Number.parseInt(configuredTokenLifetime) / (60 * 1000),
							)} minutes. Reset to default of 1 hour to resume normal token expiration behavior.`
						: "Token lifetime is 1 hour by default. Reduce it to 45 seconds in order to test token expiration behavior more reasonably."}
				</p>
			</li>
			<SendLargeMessageTool
				sizeKb={17}
				extraDescription="This is just slightly over the 16Kb message size limit imposed by Alfred, so it should trigger chunking if enabled, or Alfred message size verification if enabled."
				{...props}
			/>
			<SendLargeMessageTool
				sizeKb={200}
				extraDescription="This is greater than the default body-parser limit of 100Kb, so it can be used to trigger an incremental summary >100Kb to validate correct HTTP limit configurations."
				{...props}
			/>
			<SendLargeMessageTool
				sizeKb={700}
				extraDescription="This is less than the runtime's configured Op size limit of 768Kb, so it can be used to send several large ops to generate a large incremental summary."
				{...props}
			/>
			<SendLargeMessageTool
				sizeKb={800}
				extraDescription="This is greater than the runtime's configured Op size limit of 768Kb, so it should trigger an 'Op Too Large' error and container close if chunking is disabled."
				{...props}
			/>
			<SendLargeMessagesTool count={2} sizeKb={500} {...props} />
			<SendLargeMessagesTool count={5} sizeKb={200} {...props} />
			<SendLargeMessagesTool count={10} sizeKb={100} {...props} />
		</ul>
	);
};

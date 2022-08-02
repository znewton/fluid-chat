import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConnectionState, IFluidContainer } from "fluid-framework";
import React from "react";
import { IUser } from "../definitions";
import { createAndSetPlainMessage, createAndSetPointerMessage } from "../fluid";
import { Kilobyte, randomString } from "../utils";
import { Menu } from "./Menu";

export interface IToolsMenuProps extends IMessageFormProps {
}
const ToolsMenuContent: React.FunctionComponent<IToolsMenuProps> = (props: IToolsMenuProps) => {
    const handleDisconnect: React.MouseEventHandler<HTMLLIElement> = (e) => {
        console.log("-- disconnecting from document --");
        props.container.disconnect();
    };
    const handleLeave: React.MouseEventHandler<HTMLLIElement> = (e) => {
        console.log("Leaving...")
        props.container.dispose();
    };
    const handleExpand: React.MouseEventHandler<HTMLLIElement> = (e) => {
        props.handleExpandCollapse(true);
    };
    const handleCollapse: React.MouseEventHandler<HTMLLIElement> = (e) => {
        props.handleExpandCollapse(false);
    };
    const handleSend17KbMessage: React.MouseEventHandler<HTMLLIElement> = (e) => {
        const messageContent = `Large 17kb: ${randomString()[0].repeat(17 * Kilobyte)}`;
        createAndSetPointerMessage(props.container, props.user, messageContent);
    };
    const handleSend200KbMessage: React.MouseEventHandler<HTMLLIElement> = (e) => {
        const messageContent = `Large 200kb: ${randomString().repeat(20 * Kilobyte)}`;
        createAndSetPointerMessage(props.container, props.user, messageContent);
    };
    const handleSend800KbMessage: React.MouseEventHandler<HTMLLIElement> = (e) => {
        const messageContent = `Large 800kb: ${randomString().repeat(80 * Kilobyte)}`;
        createAndSetPointerMessage(props.container, props.user, messageContent);
    };
    const handleSend2x600KbMessages: React.MouseEventHandler<HTMLLIElement> = (e) => {
        const message1Content = `1 - Large 600kb: ${randomString().repeat(60 * Kilobyte)}`;
        const message2Content = `2 - Large 600kb: ${randomString().repeat(60 * Kilobyte)}`;
        createAndSetPointerMessage(props.container, props.user, message1Content);
        createAndSetPointerMessage(props.container, props.user, message2Content);
    };
    const createNewSessionWithHeavyPayload: React.MouseEventHandler<HTMLLIElement> = (e) => {
        window.location.assign("/?initialpayload");
    };
    return (
        <ul className="tools-menu" role="menu">
            <li role="menuitem" onClick={handleDisconnect}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "plug-circle-exclamation"]} /></span>
                    <strong>Disconnect</strong>
                </p>
                <p>Disconnect from session without destroying container. Reconnect by sending a message or pressing "Enter" in the message input area.</p>
            </li>
            <li role="menuitem" onClick={handleLeave}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "hand-peace"]} /></span>
                    <strong>Leave</strong>
                </p>
                <p>Disconnect from session and dispose of container completely. Requires page refresh to reconnect.</p>
            </li>
            <li role="menuitem" onClick={handleExpand}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "expand"]} /></span>
                    <strong>Expand Large Messages</strong>
                </p>
                <p>Disable truncation of long messages.</p>
            </li>
            <li role="menuitem" onClick={handleCollapse}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "compress"]} /></span>
                    <strong>Collapse Large Messages</strong>
                </p>
                <p>Truncate long messages.</p>
            </li>
            <li role="menuitem" onClick={handleSend17KbMessage}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "envelope"]} /></span>
                    <strong>Send 17Kb Message</strong>
                </p>
                <p>Send a 17Kb message as an individual SharedMap DDS. This is just slightly over the 16Kb message size limit imposed by Alfred, so it should trigger chunking if enabled, or Alfred message size verification if enabled.</p>
            </li>
            <li role="menuitem" onClick={handleSend200KbMessage}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "envelope"]} /></span>
                    <strong>Send 200Kb Message</strong>
                </p>
                <p>Send a 200Kb message as an individual SharedMap DDS. This is greater than the default body-parser limit of 100Kb, so it can be used to trigger an incremental summary &gt;100Kb to validate correct HTTP limit configurations.</p>
            </li>
            <li role="menuitem" onClick={handleSend800KbMessage}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "envelope"]} /></span>
                    <strong>Send 800Kb Message</strong>
                </p>
                <p>Send an 800Kb message as an individual SharedMap DDS. This is greater than the runtime's configured Op limit of 768Kb, so it should trigger an "Op Too Large" error and container close if chunking is disabled.</p>
            </li>
            <li role="menuitem" onClick={handleSend2x600KbMessages}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "envelopes-bulk"]} /></span>
                    <strong>Send 2x 600Kb Messages</strong>
                </p>
                <p>Send 2, 600kb messages as individual SharedMap DDS's in quick succession. Useful for triggering a bug where message size exceeds Socket.io's maxHttpBufferSize of 1Mb, even though it is multiple ops.</p>
            </li>
            <li role="menuitem" onClick={createNewSessionWithHeavyPayload}>
                <p>
                    <span className="menu-icon"><FontAwesomeIcon icon={["fas", "weight-hanging"]} /></span>
                    <strong>Create New Session with 10Mb Initial Payload</strong>
                </p>
                <p>Opens a new chat session (document) with a hidden payload of 10Mb. This is useful for debugging issues or checking performance with large initial summary sizes being sent to Alfred.</p>
            </li>
        </ul>
    );
}

export interface IMessageFormProps {
    container: IFluidContainer | undefined;
    user: IUser;
    handleExpandCollapse: (expand: boolean) => void;
}

export const MessageForm: React.FunctionComponent<IMessageFormProps> = (props: IMessageFormProps) => {
    const [input, setInput] = React.useState<string>("");

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setInput(e.target.value);
    };
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!props.container) {
            return;
        }

        const inputTrimmed = input.trim();
        if (props.container.connectionState === ConnectionState.Disconnected) {
            console.log("-- reconnecting to document --");
            props.container.connect();
        }

        if (inputTrimmed.length > 0) {
            if (inputTrimmed.length < 140) {
                createAndSetPlainMessage(props.container, props.user, inputTrimmed);
            } else {
                createAndSetPointerMessage(props.container, props.user, inputTrimmed);
            }
        }

        setInput("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Menu
                name="Tools"
                icon={["fas", "screwdriver-wrench"]}
                content={<ToolsMenuContent {...props} />}
                vPosition="from-top"
                hPosition="from-left"
            />
            <input value={input} onChange={handleInput} placeholder="Send a message..." />
            <button type="submit" >
                <FontAwesomeIcon icon={["fas", "paper-plane"]} title="send message" />
                &nbsp;&nbsp;Send
            </button>
        </form>
    )
}
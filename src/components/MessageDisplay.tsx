import { SharedMap } from "fluid-framework";
import React from "react";
import { contentKey, IPointerMessage, IUser, Messages } from "../definitions";
import { getHexCodeColorFromString } from "../utils";
import { Help } from "./Help";

interface IMessageProps {
    content: string;
    sender: string;
    expandLong: boolean;
    isCurrentUser: boolean;
}
const Message: React.FunctionComponent<IMessageProps> = (props: IMessageProps) => {
    const body = !props.expandLong && props.content.length > 140 ?
        `${props.content.substring(0, 140)}...` :
        `${props.content}`;
    const senderColor = getHexCodeColorFromString(props.sender);
    return (
        <div className={`message ${props.isCurrentUser ? "current-user" : ""}`.trim()}>
            <div className="message-sender">{props.sender}</div>
            <div lang="en" className="message-content" style={{ backgroundColor: `#${senderColor}66` }}>{body}</div>
        </div>
    );
};

interface IPointerMessageProps extends Omit<IMessageProps, "content"> {
    pointer: IPointerMessage["handle"];
}
const PointerMessage: React.FunctionComponent<IPointerMessageProps> = (props: IPointerMessageProps) => {
    const [content, setContent] = React.useState<string>("Loading...");
    React.useEffect(() => {
        (async () => {
            const map = await props.pointer.get() as SharedMap;
            setContent(map.get<string>(contentKey));
        })()
    }, []);
    return <Message
        content={content}
        sender={props.sender}
        isCurrentUser={props.isCurrentUser}
        expandLong={props.expandLong}
    />
};

const EmptySessionDisplay: React.FunctionComponent = () => {
    return (
        <div className="empty-session-display">
            <Help />
        </div>
    )
}

export const MessagesDisplay: React.FunctionComponent<{ messages: Messages, user: IUser, expandLong: boolean }> = (props) => {
    const messages = props.messages === undefined ? [] :
        [...props.messages].reverse().map((message) => {
            const isCurrentUser = message.sender === props.user.id;
            if (message.type === "plain") {
                return <Message
                    key={message.id}
                    content={message.content}
                    sender={message.sender}
                    isCurrentUser={isCurrentUser}
                    expandLong={props.expandLong}
                />
            } else if (message.type === "plain-large") {
                return <PointerMessage
                    key={message.id}
                    pointer={message.handle}
                    sender={message.sender}
                    isCurrentUser={isCurrentUser}
                    expandLong={props.expandLong}
                />;
            }
            return undefined;
        });
    return <div className="messages">
        {messages.length === 0 ? <EmptySessionDisplay /> : messages}
    </div>
};

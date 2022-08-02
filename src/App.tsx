import React from "react";
import { ConnectionState, IFluidContainer, SharedMap } from "fluid-framework";
import { Timer, MessagesDisplay, UserForm, MessageForm, ThemeToggle, Menu, Help } from "./components";
import { IUser, Messages, messagesKey } from "./definitions";
import { localStorageManager, usernameKey } from "./utils";
import { getFluidData } from "./fluid";

export function App() {
    const [container, setContainer] = React.useState<IFluidContainer>();
    const [user, setUser] = React.useState<IUser>();

    React.useEffect(() => {
        const username = localStorageManager.get(usernameKey);
        getFluidData(username)
            .then(({ container, user }) => {
                setContainer(container);
                setUser(user);
            });
    }, []);

    const [messages, setMessages] = React.useState<Messages>();
    const [connected, setConnected] = React.useState<boolean>(false);
    const [expanded, setExpanded] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!container) {
            return;
        }
        container.on("disconnected", () => {
            if (container.disposed) {
                console.log("Disconnected due to container close. Goodbye");
            }
            console.log("-- disconnected from document --");
            console.time("disconnected");
            setConnected(false);
        });
        container.on("connected", () => {
            console.log("-- connected to document --");
            console.timeEnd("disconnected");
            setConnected(true);
        });
        container.on("disposed", () => {
            console.log("Container disposed");
        });
        const map: SharedMap = container.initialObjects.map as SharedMap;
        const updateMessages = () => {
            setMessages([...(map.get(messagesKey) ?? [])]);
        };

        updateMessages();
        if (container.connectionState === ConnectionState.Connected) {
            setConnected(true);
        }

        map.on("valueChanged", updateMessages);

        return () => { map.off("valueChanged", updateMessages) };
    }, [container]);

    const messageDisplay = React.useMemo(() => {
        return <MessagesDisplay messages={messages} expandLong={expanded} user={user} />
    }, [messages]);

    const connectionStatus = React.useMemo(() => (
        <div className="connection-status">
            {connected ? <div className="connected">Connected <Timer key="connected" /></div> : <div className="disconnected">Disconnected <Timer key="disconnected" /></div>}
        </div>),
        [connected],
    );

    return (
        <div className={`App`}>
            <nav className="toolbar">
                <div className="toolbar-left">
                    <h1>Fluid Chat</h1>
                    <Menu
                        name="Help"
                        icon={["fas", "question-circle"]}
                        content={<Help />}
                        hPosition="from-left"
                        vPosition="from-bottom"
                    />
                </div>
                <div className="toolbar-right">
                    <ThemeToggle />
                    {connectionStatus}
                    <UserForm user={user} />
                </div>
            </nav>
            <div className="chat">
                {messageDisplay}
                <MessageForm
                    container={container}
                    user={user}
                    handleExpandCollapse={(expanded) => setExpanded(expanded)}
                />
            </div>
        </div>
    );
}
import React from "react";
import { IFluidContainer } from "fluid-framework";
import { MessagesDisplay, UserForm, MessageForm, ThemeToggle, Menu, Help, ConnectionTimer } from "./components";
import { getFluidData } from "./fluid";
import { getCurrentUser } from "./utils";

export function App() {
    const user = React.useMemo(() => getCurrentUser(), []);
    const [container, setContainer] = React.useState<IFluidContainer>();

    React.useEffect(() => {
        getFluidData(user)
            .then(({ container }) => {
                setContainer(container);
            });
    }, []);

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
                    <ConnectionTimer container={container} />
                    <UserForm user={user} />
                </div>
            </nav>
            <div className="chat">
                <MessagesDisplay container={container} user={user} />
                <MessageForm
                    container={container}
                    user={user}
                />
            </div>
        </div>
    );
}
import { ConnectionState, IFluidContainer } from "fluid-framework";
import React from "react";
import { Timer } from "./Timer";

interface IConnectionTimerProps {
    container: IFluidContainer;
}
export const ConnectionTimer: React.FunctionComponent<IConnectionTimerProps> = (props) => {
    const [connected, setConnected] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!props.container) {
            return;
        }
        props.container.on("disconnected", () => {
            if (props.container.disposed) {
                console.log("Disconnected due to container close. Goodbye");
            }
            console.log("-- disconnected from document --");
            console.time("disconnected");
            setConnected(false);
        });
        props.container.on("connected", () => {
            console.log("-- connected to document --");
            console.timeEnd("disconnected");
            setConnected(true);
        });
        props.container.on("disposed", () => {
            console.log("Container disposed");
        });
        if (props.container.connectionState === ConnectionState.Connected) {
            setConnected(true);
        }
    }, [props.container]);

    return (
        <div className="connection-status">
            {connected
                ? <div className="connected">Connected<br /><Timer key="connected" /></div>
                : <div className="disconnected">Disconnected<br /><Timer key="disconnected" /></div>
            }
        </div>
    );
};

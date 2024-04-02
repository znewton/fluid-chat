import type { IFluidContainer } from "@fluidframework/fluid-static";
import { ConnectionState } from "@fluidframework/container-loader";
import React from "react";
import { RiWifiFill, RiWifiOffFill } from "react-icons/ri";
import { Timer } from "./Timer";

interface IConnectionTimerProps {
	container: IFluidContainer | undefined;
}

export const ConnectionTimer: React.FunctionComponent<IConnectionTimerProps> = (
	props,
) => {
	const [connected, setConnected] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (!props.container) {
			return;
		}
		const container = props.container;
		const disconnectedListener = () => {
			if (container.disposed) {
				console.log("Disconnected due to container close. Goodbye");
			}
			console.log("-- disconnected from document --");
			console.time("disconnected");
			setConnected(false);
		};
		container.on("disconnected", disconnectedListener);
		const connectedListener = async () => {
			console.log("-- connected to document --");
			console.timeEnd("disconnected");
			setConnected(true);
		};
		container.on("connected", connectedListener);
		const disposedListener = () => {
			console.log("Container disposed");
		};
		container.on("disposed", disposedListener);
		if (container.connectionState === ConnectionState.Connected) {
			setConnected(true);
		}
		return () => {
			container.off("disconnected", disconnectedListener);
			container.off("connected", connectedListener);
			container.off("disposed", disposedListener);
		};
	}, [props.container]);

	return (
		<div className="connection-status">
			{connected ? (
				<div className="connected" title="Connected to service">
					<span className="timer-label">
						<RiWifiFill />
					</span>
					<Timer key="connected" />
				</div>
			) : (
				<div className="disconnected" title="Disconnected from service">
					<span className="timer-label">
						<RiWifiOffFill />
					</span>
					<Timer key="disconnected" />
				</div>
			)}
		</div>
	);
};

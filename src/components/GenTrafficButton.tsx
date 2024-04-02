import React from "react";
import { RiLoopRightFill } from "react-icons/ri";
import type { IFluidContainer } from "@fluidframework/fluid-static";
import type { IFluidChatUser } from "../definitions";
import { createAndSetPlainMessage, createAndSetPointerMessage } from "../fluid";
import {
	canWrite,
	generateLargeMessage,
	generateLoremIpsumMessage,
	getRandomUser,
} from "../utils";

export interface IGenTrafficButtonProps {
	currentUser: IFluidChatUser;
	container: IFluidContainer | undefined;
}

export const GenTrafficButton: React.FunctionComponent<IGenTrafficButtonProps> =
	(props) => {
		const [working, setWorking] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (!working) {
				return;
			}
			const genTraffic = (stress = false): void => {
				if (!props.container) return;
				// Generate user
				const user = getRandomUser(props.currentUser);

				// Generate & send message
				if (stress) {
					const rand = Math.random();
					if (rand < 0.01) {
						// 1% chance to send 700kb message
						const message = generateLargeMessage(700);
						createAndSetPointerMessage(props.container, user, message);
					} else if (rand < 0.2) {
						// 10% chance to send 200kb message
						const message = generateLargeMessage(200);
						createAndSetPointerMessage(props.container, user, message);
					} else {
						// 80% chance to send small message
						const message = generateLoremIpsumMessage();
						createAndSetPlainMessage(props.container, user, message);
					}
				} else {
					const message = generateLoremIpsumMessage();
					createAndSetPlainMessage(props.container, user, message);
				}
			};
			// Send a new message every 500ms
			const interval = setInterval(genTraffic, 500);
			return () => clearInterval(interval);
		}, [props.container, props.currentUser, working]);
		const handleToggleGenTraffic: React.MouseEventHandler<HTMLButtonElement> = (
			e,
		) => {
			setWorking(!working);
		};

		const disableInputs = !canWrite(props.currentUser);

		return (
			<button
				type="button"
				onClick={handleToggleGenTraffic}
				disabled={disableInputs}
			>
				<RiLoopRightFill className={working ? "spin" : ""} />
				&nbsp;&nbsp;Gen Traffic
			</button>
		);
	};

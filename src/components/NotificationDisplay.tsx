import type { IFluidContainer } from "@fluidframework/fluid-static";
import React from "react";
import type { IFluidChatUser } from "../definitions";
import type { Signaler } from "@fluid-experimental/data-objects";
import { type Reaction, ReactionToEmojiMap } from "./Reactions";

const NotificationTimeoutMs = 3000; // 3 seconds

export interface INotificationDisplayProps {
	container: IFluidContainer | undefined;
	user: IFluidChatUser;
}

export interface INotification {
	id: string;
	type: "reaction";
	sender: IFluidChatUser;
	content: Reaction;
}

export const NotificationDisplay: React.FunctionComponent<
	INotificationDisplayProps
> = ({ container, user }) => {
	const [notifications, setNotifications] = React.useState<INotification[]>([]);
	React.useEffect(() => {
		if (!container) {
			return;
		}
		const timeouts: Set<ReturnType<typeof setTimeout>> = new Set();
		const signaler: Signaler | undefined = container?.initialObjects
			?.signaler as Signaler | undefined;
		if (!signaler) {
			console.warn("No Signaler found in container");
			return;
		}
		const notificationListener = (
			clientId: string,
			local: boolean,
			notification: INotification,
		) => {
			console.log(
				`Notification from ${notification.sender.id}`,
				notification.type,
				notification.content,
			);
			setNotifications((prev) => [...prev, notification]);
			timeouts.add(
				setTimeout(() => {
					setNotifications((prev) => prev.slice(1));
				}, NotificationTimeoutMs),
			);
		};
		signaler?.onSignal("notification", notificationListener);
		return () => {
			signaler?.offSignal("notification", notificationListener);
			for (const timeout of Array.from(timeouts)) {
				clearTimeout(timeout);
			}
		};
	}, [container]);
	return (
		<ul className="notifications-list">
			{notifications.map((notification) => (
				<li
					key={notification.id}
					className={`notification-item ${notification.type}-notification ${
						notification.sender.id === user.id ? "self-notification" : ""
					}`}
				>
					{notification.type === "reaction" && (
						<>
							<span className="notification-icon">
								{ReactionToEmojiMap[notification.content]}
							</span>
							<span className="notification-content">
								{notification.sender.id}
							</span>
						</>
					)}
				</li>
			))}
		</ul>
	);
};

import { IFluidContainer } from "@fluidframework/fluid-static";
import React from "react";
import { IFluidChatUser } from "../definitions";
import { Signaler } from "@fluid-experimental/data-objects";
import { Reaction, ReactionToEmojiMap } from "./Reactions";

const NotificationTimeoutMs = 3000; // 3 seconds

export interface INotificationDisplayProps {
  container: IFluidContainer;
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
    const signaler: Signaler | undefined = container?.initialObjects?.signaler;
    const notificationListener = (
      clientId: string,
      local: boolean,
      notification: INotification
    ) => {
      console.log(
        `Notification from ${notification.sender.id}`,
        notification.type,
        notification.content
      );
      if (notification.sender.id === user.id) {
        return;
      }
      setNotifications((prev) => [...prev, notification]);
      timeouts.add(
        setTimeout(() => {
          setNotifications((prev) => prev.slice(1));
        }, NotificationTimeoutMs)
      );
    };
    signaler?.onSignal("notification", notificationListener);
    return () => {
      signaler?.offSignal("notification", notificationListener);
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [container, user]);
  return (
    <ul className="notifications-list">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`notification-item ${notification.type}-notification`}
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

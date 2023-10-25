import React from "react";
import { IChat, clearChatList } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IChatListProps {
  activeChatId?: string;
  chats: IChat[];
  onChatSelect: (id: string) => void;
  onClearHistory: () => void;
}

export const ChatList: React.FunctionComponent<IChatListProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onClearHistory,
}) => {
  const handleClearHistory = () => {
    clearChatList().catch((e) => {
      console.error("Failed to clear chat history.", e);
    });
  };
  return (
    <div className="chat-list">
      <div className="chat-list-title">
        <span>
          <span className="fa-layers fa-fw fa-lg" title="create new chat">
            <FontAwesomeIcon
              icon={["fas", "message"]}
              transform="shrink-4 up-2 left-2"
            />
            <FontAwesomeIcon
              icon={["fas", "message"]}
              transform="shrink-4 down-4 right-4 flip-h"
              inverse
            />
            <FontAwesomeIcon
              icon={["fas", "message"]}
              transform="shrink-6 down-4 right-4 flip-h"
            />
          </span>
          &nbsp;&nbsp;Recent Chat History
        </span>
        <button className="chat-list-clear" onClick={onClearHistory}>
          <FontAwesomeIcon icon={["fas", "trash"]} />
          &nbsp;&nbsp;Clear
        </button>
      </div>
      <menu className="chat-list-menu">
        {chats.slice(0, 5).map((chat) => {
          return (
            <li
              className={`btn chat-list-item ${
                activeChatId === chat.id ? "active" : ""
              }`}
            >
              <a
                href={`/#${chat.id}`}
                className="chat-list-item-link"
                onClick={() => onChatSelect(chat.id)}
              >
                <span className="chat-list-item-title">{chat.id}</span>
                <span className="chat-list-item-subtext">
                  Created:{" "}
                  {new Date(chat.creationDatetime).toLocaleDateString()}
                </span>
                <span className="chat-list-item-subtext">
                  Last Opened:{" "}
                  {new Date(chat.lastOpenedDatetime).toLocaleDateString()}
                </span>
              </a>
            </li>
          );
        })}
      </menu>
    </div>
  );
};

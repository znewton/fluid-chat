import type React from "react";
import { RiChatHistoryFill, RiDeleteBinFill } from "react-icons/ri";
import type { IChat } from "../utils";

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
	return (
		<div className="chat-list">
			<div className="chat-list-title">
				<span className="text-icon-row">
					<RiChatHistoryFill />
					&nbsp;Recent Chat History
				</span>
				<button
					type="button"
					className="chat-list-clear"
					onClick={onClearHistory}
				>
					<RiDeleteBinFill />
					&nbsp;&nbsp;Clear
				</button>
			</div>
			<nav className="chat-list-menu">
				{chats.slice(0, 5).map((chat) => {
					return (
						<a
							href={`/#${chat.id}`}
							className={`btn chat-list-item ${
								activeChatId === chat.id ? "active" : ""
							}`}
							onClick={() => onChatSelect(chat.id)}
							key={chat.id}
						>
							<span className="chat-list-item-title">{chat.id}</span>
							<span className="chat-list-item-subtext">
								Created: {new Date(chat.creationDatetime).toLocaleDateString()}
							</span>
							<span className="chat-list-item-subtext">
								Last Opened:{" "}
								{new Date(chat.lastOpenedDatetime).toLocaleDateString()}
							</span>
						</a>
					);
				})}
			</nav>
		</div>
	);
};

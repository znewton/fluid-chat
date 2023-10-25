import React from "react";
import { RiGithubFill, RiQuestionFill, RiUserAddFill } from "react-icons/ri";
import {
  ThemeToggle,
  Menu,
  Help,
  ChatNavForm,
  FluidLogo,
  ChatTab,
  ChatList,
} from "./components";
import {
  IChat,
  clearChatList,
  getDocumentIdFromUrl,
  setDocumentIdInUrl,
  updateChatList,
} from "./utils";
import { v4 as uuid } from "uuid";

export function App() {
  const [docId, setDocId] = React.useState<string | undefined>(
    getDocumentIdFromUrl()
  );
  const [chatTabs, setChatTabs] = React.useState<string[]>([uuid()]);
  const [chatList, setChatList] = React.useState<IChat[]>([]);

  const navigateToDocument = (id?: string | "new"): void => {
    const docId = id === "new" ? undefined : id ?? getDocumentIdFromUrl();
    if (chatTabs.length === 0) {
      setChatTabs([uuid()]);
    }
    setDocId(docId);
  };

  const handleDocumentIdChange = (newDocumentId: string) => {
    setDocumentIdInUrl(newDocumentId);
    setDocId(newDocumentId);
  };

  const addChatTab = () => {
    setChatTabs([...chatTabs, uuid()]);
  };
  const addReaderChatTab = () => {
    setChatTabs([...chatTabs, `reader:${uuid()}`]);
  };

  const handleCloseChatTab = (id: string) => {
    setChatTabs([...chatTabs].filter((tabId) => tabId !== id));
  };

  const handleClearChatHistory = () => {
    clearChatList()
      .then(() => {
        setChatList([]);
      })
      .catch((e) => {
        console.error("Failed to clear chat history.", e);
      });
  };

  React.useEffect(() => {
    navigateToDocument();
  }, []);

  React.useEffect(() => {
    updateChatList(docId).then((chats) => {
      setChatList(chats);
    });
  }, [docId]);

  return (
    <div className={`App`}>
      <section className="side-nav">
        <nav className="toolbar">
          <div className="toolbar-column">
            <div className="toolbar-row">
              <h1>
                <FluidLogo /> Fluid Chat
              </h1>
            </div>
            <div className="toolbar-row" style={{ marginTop: "1em" }}>
              <ThemeToggle />
              <Menu
                name="Help"
                icon={<RiQuestionFill />}
                content={<Help />}
                hPosition="from-left"
                vPosition="from-bottom"
              />
            </div>
          </div>
          <div className="toolbar-column">
            <ChatList
              chats={chatList}
              onChatSelect={navigateToDocument}
              activeChatId={docId}
              onClearHistory={handleClearChatHistory}
            />
          </div>
          <div className="toolbar-column">
            <div className="toolbar-row">
              <span>
                Created by{" "}
                <a href="https://github.com/znewton" target="_blank">
                  Zach
                </a>
              </span>
              <a
                href="https://github.com/znewton/fluid-chat"
                target="_blank"
                style={{ fontSize: "1.5em" }}
              >
                <RiGithubFill />
              </a>
            </div>
          </div>
        </nav>
      </section>
      <main className="main-app">
        <nav className="toolbar">
          <ChatNavForm currentDocId={docId} onSubmit={navigateToDocument} />
          <div>
            <button type="button" onClick={addChatTab}>
              <RiUserAddFill />
              &nbsp;&nbsp;Add Client
            </button>
            <button type="button" onClick={addReaderChatTab}>
              <RiUserAddFill />
              &nbsp;&nbsp;Add Read Client
            </button>
          </div>
        </nav>
        {chatTabs.map((id) => {
          return (
            <ChatTab
              key={id}
              documentId={docId}
              readonly={id.startsWith("reader:")}
              onDocumentIdChange={handleDocumentIdChange}
              onCloseClient={() => handleCloseChatTab(id)}
            />
          );
        })}
        {chatTabs.length === 0 && <Help />}
      </main>
    </div>
  );
}

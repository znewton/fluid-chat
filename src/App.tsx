import React from "react";
import {
  MessagesDisplay,
  MessageForm,
  ThemeToggle,
  Menu,
  Help,
  ChatNavForm,
  FluidLogo,
} from "./components";
import { IFluidDocument, IUser } from "./definitions";
import { getFluidData } from "./fluid";
import { genUserId, getDocumentIdFromUrl, setDocumentIdInUrl } from "./utils";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AudienceDisplay } from "./components/AudienceDisplay";

interface IChatTabProps {
  documentId: string;
  readonly?: boolean;
  onDocumentIdChange: (id: string) => void;
  onCloseClient?: () => void;
}
const ChatTab: React.FunctionComponent<IChatTabProps> = (
  props: IChatTabProps
) => {
  const [document, setDocument] = React.useState<IFluidDocument>();
  const user: IUser = React.useMemo(
    () => ({
      id: genUserId(),
      temp: true,
      permissions: props.readonly ? ["read"] : ["read", "write"],
    }),
    []
  );
  React.useEffect(() => {
    if (document) {
      if (document?.id === props.documentId) {
        return;
      }
      // DocId changed. Dispose old container before creating new one.
      document?.container.dispose();
    }
    let doc: IFluidDocument | undefined;
    getFluidData(props.documentId, user).then((fluidDocument) => {
      setDocument(fluidDocument);
      doc = fluidDocument;
      if (fluidDocument?.id !== props.documentId) {
        props.onDocumentIdChange?.(fluidDocument.id);
      }
    });
    return () => {
      // Try to make sure we clean up on unmount
      (doc ?? document)?.container.dispose();
    };
  }, [props.documentId]);

  const closeClient = React.useCallback(() => {
    document?.container.dispose();
    props.onCloseClient?.();
  }, [props.onCloseClient]);

  return (
    <div className="chat">
      <nav className="toolbar">
        <AudienceDisplay
          audience={document?.services?.audience}
          currentUser={user}
        />
        <button onClick={closeClient} title="Close Client">
          <FontAwesomeIcon icon={["fas", "xmark"]} title="Close client" />
        </button>
      </nav>
      <MessagesDisplay container={document?.container} user={user} />
      <MessageForm container={document?.container} user={user} />
    </div>
  );
};

export function App() {
  const [docId, setDocId] = React.useState<string | undefined>(
    getDocumentIdFromUrl()
  );
  const [chatTabs, setChatTabs] = React.useState<string[]>([uuid()]);

  const navigateToDocument = (id?: string | "new"): void => {
    const docId = id === "new" ? undefined : id ?? getDocumentIdFromUrl();
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

  React.useEffect(() => {
    navigateToDocument();
  }, []);

  return (
    <div className={`App`}>
      <section className="side-nav">
        <nav className="toolbar">
          <div className="toolbar-row">
            <h1>
              <FluidLogo /> Fluid Chat
            </h1>
            <Menu
              name="Help"
              icon={["fas", "question-circle"]}
              content={<Help />}
              hPosition="from-left"
              vPosition="from-bottom"
            />
          </div>
          <div className="toolbar-column">
            <div className="toolbar-row">
              <ThemeToggle />
              <a
                href="https://github.com/znewton/fluid-chat"
                target="_blank"
                style={{ color: "white", fontSize: "1.5em" }}
              >
                <FontAwesomeIcon
                  icon={["fab", "github"]}
                  title="View source on GitHub"
                />
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
              <FontAwesomeIcon
                icon={["fas", "user-plus"]}
                title="Add additional client"
              />
              &nbsp;&nbsp;Add Client
            </button>
            <button type="button" onClick={addReaderChatTab}>
              <FontAwesomeIcon
                icon={["fas", "user-plus"]}
                title="Add additional client"
              />
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

import React from "react";
import {
  MessagesDisplay,
  UserForm,
  MessageForm,
  ThemeToggle,
  Menu,
  Help,
  ConnectionTimer,
  ChatNavForm,
  FluidLogo,
} from "./components";
import { IFluidDocument, IUser } from "./definitions";
import { getFluidData } from "./fluid";
import {
  getCurrentUser,
  getDocumentIdFromUrl,
  setDocumentIdInUrl,
} from "./utils";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IChatTabProps {
  documentId: string;
  user: IUser;
  onDocumentIdChange: (id: string) => void;
}
const ChatTab: React.FunctionComponent<IChatTabProps> = (
  props: IChatTabProps
) => {
  const [document, setDocument] = React.useState<IFluidDocument>();
  React.useEffect(() => {
    if (document && document?.id === props.documentId) {
      return;
    }
    getFluidData(props.documentId).then((fluidDocument) => {
      setDocument(fluidDocument);
      if (fluidDocument?.id !== props.documentId) {
        props.onDocumentIdChange?.(fluidDocument.id);
      }
    });
  }, [props.documentId]);
  return (
    <div className="chat">
      <MessagesDisplay container={document?.container} user={props.user} />
      <MessageForm container={document?.container} user={props.user} />
    </div>
  );
};

export function App() {
  const user = React.useMemo(() => getCurrentUser(), []);
  const [docId, setDocId] = React.useState<string | undefined>();
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
            </div>
          </div>
        </nav>
      </section>
      <main className="main-app">
        <nav className="toolbar">
          <ChatNavForm currentDocId={docId} onSubmit={navigateToDocument} />
          <button type="button" onClick={addChatTab}>
            <FontAwesomeIcon
              icon={["fas", "user-plus"]}
              title="Add additional client"
            />
            &nbsp;&nbsp;Add Client
          </button>
          <UserForm user={user} />
        </nav>
        {chatTabs.map((id) => {
          return (
            <ChatTab
              key={id}
              documentId={docId}
              user={user}
              onDocumentIdChange={handleDocumentIdChange}
            />
          );
        })}
      </main>
    </div>
  );
}

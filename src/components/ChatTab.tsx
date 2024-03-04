import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { MessagesDisplay } from "./MessageDisplay";
import { MessageForm } from "./MessageForm";
import { AudienceDisplay } from "./AudienceDisplay";
import { IFluidDocument, IUser } from "../definitions";
import { getFluidData } from "../fluid";
import { genUserId } from "../utils";
import { ConnectionTimer } from "./ConnectionTimer";

export interface IChatTabProps {
  documentId: string;
  readonly?: boolean;
  onDocumentIdChange: (id: string) => void;
  onCloseClient?: () => void;
}

export const ChatTab: React.FunctionComponent<IChatTabProps> = (
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
      console.log("new container detected, disposing old one", {
        old: document?.id,
        new: props.documentId,
      });
      // DocId changed. Dispose old container before creating new one.
      document?.container.dispose();
    }
    console.log("Connecting User:", user);
    let doc: IFluidDocument | undefined;
    getFluidData(props.documentId, user).then((fluidDocument) => {
      setDocument(fluidDocument);
      doc = fluidDocument;
      if (fluidDocument?.id !== props.documentId) {
        props.onDocumentIdChange?.(fluidDocument.id);
      }
    });
  }, [props.documentId]);

  const closeClient = React.useCallback(() => {
    document?.container.dispose();
    props.onCloseClient?.();
  }, [props.onCloseClient, document]);

  return (
    <div className="chat">
      <nav className="toolbar">
        <AudienceDisplay
          audience={document?.services?.audience}
          currentUser={user}
        />
        <div className="flex-row">
          <ConnectionTimer container={document?.container} />
          <button onClick={closeClient} title="Close Client">
            <RiCloseFill />
          </button>
        </div>
      </nav>
      <MessagesDisplay container={document?.container} user={user} />
      <MessageForm container={document?.container} user={user} />
    </div>
  );
};

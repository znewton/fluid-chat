import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface IChatNavFormProps {
  currentDocId: string | undefined;
  onSubmit: (id: string | "new") => void;
}

export const ChatNavForm: React.FunctionComponent<IChatNavFormProps> = (
  props: IChatNavFormProps
) => {
  const [input, setInput] = React.useState<string>(props.currentDocId ?? "");

  React.useEffect(() => {
    setInput(props.currentDocId ?? "");
  }, [props.currentDocId]);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    props.onSubmit(input);
  };
  const handleCreateNew: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    props.onSubmit("new");
  };
  const handleBlur = () => {
    if (!input) {
      setInput(props.currentDocId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-nav-form">
      <div className="hover-label">
        <input
          id="document-id-input"
          value={input}
          onBlur={handleBlur}
          onChange={handleInput}
          placeholder="Navigate to a different chat..."
          size={36}
          autoComplete="on"
        />
        <label htmlFor="document-id-input">Chat ID</label>
      </div>
      <button type="submit" disabled={props.currentDocId === input}>
        <FontAwesomeIcon icon={["fas", "location-arrow"]} title="go to chat" />
        &nbsp;&nbsp;Go
      </button>
      <button type="button" onClick={handleCreateNew}>
        <span className="fa-layers fa-fw fa-lg" title="create new chat">
          <FontAwesomeIcon icon={["fas", "message"]} />
          <FontAwesomeIcon
            icon={["fas", "circle"]}
            transform="shrink-4 down-6 right-6"
            inverse
          />
          <FontAwesomeIcon
            icon={["fas", "circle-plus"]}
            transform="shrink-6 down-6 right-6"
          />
        </span>
        &nbsp;&nbsp;New Chat
      </button>
    </form>
  );
};

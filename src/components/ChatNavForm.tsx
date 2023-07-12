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
          placeholder="Navigate to a different document..."
          size={36}
          autoComplete="on"
        />
        <label htmlFor="document-id-input">Document ID</label>
      </div>
      <button type="submit" disabled={props.currentDocId === input}>
        <FontAwesomeIcon
          icon={["fas", "location-arrow"]}
          title="go to document"
        />
        &nbsp;&nbsp;Go
      </button>
      <button type="button" onClick={handleCreateNew}>
        <FontAwesomeIcon
          icon={["fas", "file-circle-plus"]}
          title="create new document"
        />
        &nbsp;&nbsp;New Document
      </button>
    </form>
  );
};

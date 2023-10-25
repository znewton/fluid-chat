import { IFluidContainer } from "@fluidframework/fluid-static";
import { ConnectionState } from "@fluidframework/container-loader";
import React from "react";
import { IUser } from "../definitions";
import { createAndSetPlainMessage, createAndSetPointerMessage } from "../fluid";
import { canWrite } from "../utils";
import { GenChatButton } from "./GenChatButton";
import { GenTrafficButton } from "./GenTrafficButton";
import { Menu } from "./Menu";
import { ToolsMenu } from "./ToolsMenu";
import { ConnectionTimer } from "./ConnectionTimer";
import { RiSendPlaneFill, RiToolsFill } from "react-icons/ri";

export interface IMessageFormProps {
  container: IFluidContainer | undefined;
  user: IUser;
}

export const MessageForm: React.FunctionComponent<IMessageFormProps> = (
  props: IMessageFormProps
) => {
  const [input, setInput] = React.useState<string>("");

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!props.container) {
      return;
    }

    const inputTrimmed = input.trim();
    if (props.container.connectionState === ConnectionState.Disconnected) {
      console.log("-- reconnecting to document --");
      props.container.connect();
    }

    if (inputTrimmed.length > 0) {
      if (inputTrimmed.length < 140) {
        createAndSetPlainMessage(props.container, props.user, inputTrimmed);
      } else {
        createAndSetPointerMessage(props.container, props.user, inputTrimmed);
      }
    }

    setInput("");
  };

  const disableInputs = !canWrite(props.user);

  return (
    <form onSubmit={handleSubmit}>
      <Menu
        name="Tools"
        icon={<RiToolsFill />}
        content={<ToolsMenu {...props} />}
        vPosition="from-top"
        hPosition="from-left"
      />
      <GenTrafficButton currentUser={props.user} container={props.container} />
      <input
        value={input}
        onChange={handleInput}
        placeholder="Send a message..."
        disabled={disableInputs}
      />
      <button type="submit" disabled={disableInputs}>
        <RiSendPlaneFill />
        &nbsp;&nbsp;Send
      </button>
      <GenChatButton currentUser={props.user} container={props.container} />
      <ConnectionTimer container={props.container} />
    </form>
  );
};

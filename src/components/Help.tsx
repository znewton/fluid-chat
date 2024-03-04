import React from "react";
import {
  RiSendPlaneFill,
  RiToolsFill,
  RiUserAddFill,
  RiUserFill,
} from "react-icons/ri";

export const Help: React.FunctionComponent = () => {
  return (
    <main className="help-display">
      <h1>Welcome to "Fluid Chat"</h1>
      <p>
        This is a simple chat application built with{" "}
        <a href="http://fluidframework.com" target="_blank">
          Fluid Framework
        </a>{" "}
        and{" "}
        <a href="https://react.dev" target="_blank">
          ReactJS
        </a>
        .
      </p>
      <p>
        It includes some helpful tools to debug and reproduce various scenarios.
      </p>
      <ul>
        <li>
          <p>
            <strong>Message Input (bottom):</strong>
          </p>
          <p>
            Type something here then press "Enter" or click the "
            <RiSendPlaneFill /> Send" icon (bottom right) to send a message.
          </p>
          <p>
            At a low-level, this sends an individual "op" by adding a string
            value to an array within a "messages" key in a SharedMap object.
            Plain text messages here will continue to increase the size of the
            main DDS, which can be useful for generating larger and larger ops.
          </p>
        </li>
        <li>
          <p>
            <strong>Gen Chat (bottom right):</strong>
          </p>
          <p>
            Generates a random conversation, 1 message per click, using{" "}
            <a href="https://www.lipsum.com/" target="_blank">
              Lorem Ipsum
            </a>{" "}
            text generation.
          </p>
          <p>
            Useful when trying to simply validate that ops are flowing across
            clients.
          </p>
        </li>
        <li>
          <p>
            <strong>Gen Traffic (bottom left):</strong>
          </p>
          <p>
            Generates a random conversation, 1 message per 400ms, continuously,
            until clicked again. Each message has 1% chance to be 700kb, 10%
            chance to be 200kb, and 89% chance to be small.
          </p>
          <p>
            Useful for generating mild load while multitasking or monitoring
            something else, like memory consumption.
          </p>
        </li>
        <li>
          <p>
            <strong>Tools (bottom left):</strong>
          </p>
          <p>
            Adding strings to an array is pretty limiting for reproducing
            various user scenarios. Several tools have been added to the "
            <RiToolsFill /> Tools" menu to the left of the input bar. Click the
            "
            <RiToolsFill /> Tools" menu button to view a complete list of
            special utilities and their main usecases.
          </p>
        </li>
        <li>
          <p>
            <strong>Connection timer (top right):</strong>
          </p>
          <p>
            Useful for tracking durations of connected/disconnected states. This
            is particularly helpful when trying to time events like session end
            (10 minutes disconnected) or monitoring how long it takes to join a
            session.
          </p>
        </li>
        <li>
          <p>
            <strong>Add Client (top right):</strong>
          </p>
          <p>
            By default, you will see one chat window. To add another chat client
            in the same window, click the "<RiUserAddFill />
            &nbsp; Add Client" button in the top right.
          </p>
          <p>
            To establish a read-only client, click the "<RiUserAddFill />
            &nbsp; Add Read Client".
          </p>
        </li>
        <li>
          <p>
            <strong>View Audience (top left):</strong>
          </p>
          <p>
            Useful for testing if Audience is working. Each connected client
            should be represented by a small 3 letter acronym and user icon,
            like "<RiUserFill /> PAL". The active client for that tab will be
            highlighted with a bright border.
          </p>
          <p>
            <span style={{ color: "red", fontWeight: "bold" }}>BUG:</span>{" "}
            Read-only clients <i>should</i> appear in audience, but they don't.
          </p>
        </li>
        <li>
          <p>
            <strong>Send Signal Notification (bottom right):</strong>
          </p>
          <p>
            Useful for testing if Signals are working. Click the desired
            "reaction" emoji to send a signal to all clients containing that
            emoji and who the reaction is from. Other client windows will show
            the reaction notification in the top right.
          </p>
          <p>
            <span style={{ color: "red", fontWeight: "bold" }}>BUG:</span>{" "}
            Read-only clients <i>should</i> be able to send signals, but they
            can't.
          </p>
        </li>
      </ul>
    </main>
  );
};

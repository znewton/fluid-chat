import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Help: React.FunctionComponent = () => {
    return (
        <main className="help-display">
            <h1>Welcome to "Fluid Chat"</h1>
            <p>This is a simple chat application built with Fluid Framework and ReactJS.</p>
            <p>It includes some helpful tools to debug and reproduce various scenarios.</p>
            <ul>
                <li>
                    <p><strong>Message Input (bottom):</strong></p>
                    <p>Type something here then press "Enter" or click the "<FontAwesomeIcon icon={["fas", "paper-plane"]} /> Send" icon (bottom right) to send a message.</p>
                    <p>At a low-level, this sends an individual "op" by adding a string value to an array within a "messages" key in a SharedMap object. Plain text messages here will continue to increase the size of the main DDS, which can be useful for generating larger and larger ops.</p>
                </li>
                <li>
                    <p><strong>Tools (bottom left):</strong></p>
                    <p>Adding strings to an array is pretty limiting for reproducing various user scenarios. Several tools have been added to the "<FontAwesomeIcon icon={["fas", "screwdriver-wrench"]} /> Tools" menu to the left of the input bar. Click the "<FontAwesomeIcon icon={["fas", "screwdriver-wrench"]} /> Tools" menu button to view a complete list of special utilities and their main usecases.</p>
                </li>
                <li>
                    <p><strong>Connection timer (top right):</strong></p>
                    <p>Useful for tracking durations of connected/disconnected states. This is particularly helpful when trying to time events like session end (10 minutes disconnected) or monitoring how long it takes to join a session.</p>
                </li>
                <li>
                    <p><strong>User Login (top right):</strong></p>
                    <p>By default, you will be assigned a GUID name per page load. To send messages with a consistent user id across windows/refreshes, enter a username into the "username" input then "Log in <FontAwesomeIcon icon={["fas", "right-to-bracket"]} />". This will cause you to rejoin the session as the given username. Username is stored across page loads. Username can be cleared by clicking "Log out <FontAwesomeIcon icon={["fas", "right-from-bracket"]} />".</p>
                </li>
            </ul>
        </main>
    );
};

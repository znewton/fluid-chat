import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IUser } from "../definitions";
import { userStore } from "../utils";

export interface IUserFormProps {
  user: IUser;
}

export const UserForm: React.FunctionComponent<IUserFormProps> = (
  props: IUserFormProps
) => {
  const [username, setUsername] = React.useState<string>(
    `${props.user?.id ?? ""}`
  );
  const handleLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    const name = (e.target as any).username.value;
    if (!name) {
      e.preventDefault();
      return;
    }
    userStore.setCurrentUser({
      id: name,
      temp: false,
      permissions: ["read", "write"],
    });
  };

  const handleLogout: React.FormEventHandler<HTMLFormElement> = (e) => {
    userStore.clearCurrentUser();
  };

  if (!props.user || props.user.temp) {
    return (
      <form onSubmit={handleLogin}>
        <div className="hover-label">
          <input
            type="text"
            id="username-input"
            name="username"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username-input">Username</label>
        </div>
        <button type="submit">
          Log in&nbsp;&nbsp;
          <FontAwesomeIcon icon={["fas", "right-to-bracket"]} />
        </button>
      </form>
    );
  }
  return (
    <form onSubmit={handleLogout}>
      <div className="username">
        <FontAwesomeIcon icon={["fas", "user"]} /> {props.user.id}
      </div>
      <button type="submit">
        Log out&nbsp;&nbsp;
        <FontAwesomeIcon icon={["fas", "right-from-bracket"]} />
      </button>
    </form>
  );
};

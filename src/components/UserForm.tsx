import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IUser } from "../definitions";
import { localStorageManager, usernameKey } from "../utils";

export interface IUserFormProps {
  user: IUser;
}

export const UserForm: React.FunctionComponent<IUserFormProps> = (
  props: IUserFormProps
) => {
  const handleLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    const name = (e.target as any).username.value;
    if (!name) {
      e.preventDefault();
      return;
    }
    localStorageManager.set(usernameKey, name);
  };

  const handleLogout: React.FormEventHandler<HTMLFormElement> = (e) => {
    localStorageManager.delete(usernameKey);
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

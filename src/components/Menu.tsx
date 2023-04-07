import type { IconName, IconPrefix } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface IMenuProps {
  content: React.ReactElement;
  icon: [IconPrefix, IconName];
  name: string;
  vPosition: "from-top" | "from-bottom";
  hPosition: "from-left" | "from-right";
}

export const Menu: React.FunctionComponent<IMenuProps> = (
  props: IMenuProps
) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="menu-wrapper">
      <div
        className={`menu-shadow ${open ? "open" : "closed"}`}
        onClick={() => setOpen(false)}
      ></div>
      <div
        className={`menu ${props.hPosition} ${props.vPosition} ${
          open ? "open" : "closed"
        }`}
      >
        {props.content}
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`menu-toggle ${open ? "open" : "closed"}`}
      >
        <FontAwesomeIcon
          icon={props.icon}
          title={`open / close ${props.name} menu`}
        />
        &nbsp;&nbsp;{props.name}&nbsp;&nbsp;
        <FontAwesomeIcon icon={["fas", open ? "caret-down" : "caret-up"]} />
      </button>
    </div>
  );
};

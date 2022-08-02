import { faCaretDown, faCaretUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface IMenuProps {
    content: React.ReactElement;
    icon: IconDefinition;
    name: string;
    vPosition: "from-top" | "from-bottom";
    hPosition: "from-left" | "from-right";
}

export const Menu: React.FunctionComponent<IMenuProps> = (props: IMenuProps) => {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <button type="button" onClick={() => setOpen(!open)} className={`menu-toggle ${open ? "open" : "closed"}`}>
            <FontAwesomeIcon icon={props.icon} title={`open/close ${props.name} menu`} />
            &nbsp;&nbsp;{props.name}&nbsp;&nbsp;
            <FontAwesomeIcon icon={open ? faCaretDown : faCaretUp} />
            <div className={`menu ${props.hPosition} ${props.vPosition} ${open ? "open" : "closed"}`}>
                {props.content}
            </div>
        </button>
    );
};

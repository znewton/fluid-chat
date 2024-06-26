import React from "react";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { accessibleClickHandler } from "../utils";

export interface IMenuProps {
	content: React.ReactElement;
	icon: React.ReactElement;
	name: string;
	vPosition: "from-top" | "from-bottom";
	hPosition: "from-left" | "from-right";
}

export const Menu: React.FunctionComponent<IMenuProps> = (
	props: IMenuProps,
) => {
	const [open, setOpen] = React.useState<boolean>(false);

	const handleCloseClick = accessibleClickHandler(() => {
		setOpen(false);
	});

	return (
		<div className="menu-wrapper">
			<div
				className={`menu-shadow ${open ? "open" : "closed"}`}
				onClick={handleCloseClick}
				onKeyUp={handleCloseClick}
			/>
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
				{props.icon}
				&nbsp;&nbsp;{props.name}&nbsp;&nbsp;
				{open ? <RiArrowDownSFill /> : <RiArrowUpSFill />}
			</button>
		</div>
	);
};

export function accessibleClickHandler<T = Element>(
	handler: (
		e: React.MouseEvent<T, MouseEvent> | React.KeyboardEvent<T>,
	) => void,
): React.MouseEventHandler<T> & React.KeyboardEventHandler<T> {
	return (e: React.MouseEvent<T, MouseEvent> | React.KeyboardEvent<T>) => {
		if (e.type === "keyup" && (e as React.KeyboardEvent).key !== "Enter")
			return;
		handler(e);
	};
}

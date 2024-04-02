export function getDocumentIdFromUrl(): string | undefined {
	const id = location.hash.substring(1);
	return id || undefined;
}

export function setDocumentIdInUrl(id: string): void {
	location.hash = id;
	document.title = `Fluid Chat | ${id}`;
}

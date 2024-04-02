const hashCode = (str: string) => {
	// java String#hashCode
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
};
const intToHexCode = (i: number) => {
	const c = (i & 0x00ffffff).toString(16).toUpperCase();

	return "000000".substring(0, 6 - c.length) + c;
};

export const getHexCodeColorFromString = (str: string): string => {
	return intToHexCode(hashCode(str));
};

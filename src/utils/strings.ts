// Technically 1 kB is 1024 bytes, but even numbers are more predictable, and FF uses kb as 1000.
export const Kilobyte = 1000;

/**
 * @returns random string of 10 characters
 */
export const randomString = (): string => {
	const randomStr = (Math.random() + 1).toString(36);
	return randomStr.substring(randomStr.length - 10);
};

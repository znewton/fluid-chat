import { LoremIpsum } from "lorem-ipsum";
import { Kilobyte, randomString } from "./strings";

export const generateLoremIpsumMessage = (): string => {
    const loremIpsum = new LoremIpsum();
    const sentenceCount = Math.floor(Math.random() * 2);
    const wordCount = Math.floor(Math.random() * 5);
    const message = sentenceCount ? loremIpsum.generateSentences(sentenceCount) : loremIpsum.generateWords(wordCount);
    return message;
};

export const generateLargeMessage = (sizeKb: number) => {
    const randStr = randomString();
    const repeatCount = Math.round(sizeKb / randStr.length) * Kilobyte;
    return `Large ${sizeKb}kb: ${randStr.repeat(repeatCount)}`;
};

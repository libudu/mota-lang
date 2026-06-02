import iconv from "iconv-lite";
import OpenCC from "opencc-js";

export type EncodingName = "big5" | "gbk";

export type DecodedText = {
  text: string;
  visibleText: string;
  visiblePortion: string;
  unicodeEscapes: string;
};

export type ConversionResult = {
  originalLabel: string;
  sourceText: string;
  byteLength: number;
  bytesHex: string;
  target: DecodedText;
  visiblePortionRoundTrip: {
    text: string;
    byteLength: number;
    bytesHex: string;
    source: DecodedText;
  } | null;
};

export const EXAMPLE_INPUTS = [
  "绿蝙蝠",
  "黄锁匙",
  "黑色史莱姆",
  "魔塔",
  "魔法师",
  "灵骷髅",
  "双手剑士",
] as const;

const toTraditionalChinese = OpenCC.Converter({ from: "cn", to: "tw" });

function toHexPairs(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    " ",
  );
}

function toUnicodeEscapes(text: string) {
  return Array.from(
    text,
    (char) =>
      `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`,
  ).join("");
}

function isSpecialMarker(char: string) {
  const code = char.codePointAt(0) ?? 0;
  const isPrivateUse = code >= 0xe000 && code <= 0xf8ff;
  const isReplacement = code === 0xfffd;
  return isPrivateUse || isReplacement;
}

function toVisibleText(text: string) {
  return Array.from(text, (char) =>
    isSpecialMarker(char)
      ? `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`
      : char,
  ).join("");
}

function getVisibleChars(text: string) {
  return Array.from(text)
    .filter((char) => !isSpecialMarker(char))
    .join("");
}

function encodeText(text: string, encoding: EncodingName) {
  const bytes = Uint8Array.from(iconv.encode(text, encoding));

  return {
    bytes,
    byteLength: bytes.length,
    bytesHex: toHexPairs(bytes),
  };
}

function decodeText(bytes: Uint8Array, encoding: EncodingName): DecodedText {
  const text = iconv.decode(bytes, encoding);

  return {
    text,
    visibleText: toVisibleText(text),
    visiblePortion: getVisibleChars(text),
    unicodeEscapes: toUnicodeEscapes(text),
  };
}

function reverseVisiblePortion(
  text: string,
  sourceEncoding: EncodingName = "big5",
  targetEncoding: EncodingName = "gbk",
) {
  const visibleChars = getVisibleChars(text);
  if (!visibleChars) {
    return null;
  }

  const encoded = encodeText(visibleChars, targetEncoding);

  return {
    text: visibleChars,
    byteLength: encoded.byteLength,
    bytesHex: encoded.bytesHex,
    source: decodeText(encoded.bytes, sourceEncoding),
  };
}

export function convertText(
  text: string,
  sourceEncoding: EncodingName = "big5",
  targetEncoding: EncodingName = "gbk",
): ConversionResult {
  const sourceText = toTraditionalChinese(text);
  const encoded = encodeText(sourceText, sourceEncoding);
  const target = decodeText(encoded.bytes, targetEncoding);

  return {
    originalLabel: text,
    sourceText,
    byteLength: encoded.byteLength,
    bytesHex: encoded.bytesHex,
    target,
    visiblePortionRoundTrip: reverseVisiblePortion(
      target.text,
      sourceEncoding,
      targetEncoding,
    ),
  };
}

const iconv = require("iconv-lite");
const OpenCC = require("opencc-js");

const toTraditionalChinese = OpenCC.Converter({ from: "cn", to: "tw" });

const examples = [
  "绿蝙蝠",
  "锁匙",
  "绿色史莱姆",
  "魔塔",
];

/** 将 Buffer 转成以空格分隔的十六进制字节串。 */
function toHexPairs(buffer) {
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, "0")).join(" ");
}

/** 将文本转换为连续的 Unicode 转义序列。 */
function toUnicodeEscapes(text) {
  return Array.from(text, (char) =>
    `\\u${char.codePointAt(0).toString(16).padStart(4, "0")}`,
  ).join("");
}

/** 判断字符是否为私有区或替换字符这类特殊标记。 */
function isSpecialMarker(char) {
  const code = char.codePointAt(0);
  const isPrivateUse = code >= 0xe000 && code <= 0xf8ff;
  const isReplacement = code === 0xfffd;
  return isPrivateUse || isReplacement;
}

/** 将特殊标记字符替换成可见的 Unicode 转义形式。 */
function toVisibleText(text) {
  return Array.from(text, (char) => (
    isSpecialMarker(char)
      ? `\\u${char.codePointAt(0).toString(16).padStart(4, "0")}`
      : char
  )).join("");
}

/** 提取文本中可直接显示的字符并去掉特殊标记。 */
function getVisibleChars(text) {
  return Array.from(text)
    .filter((char) => !isSpecialMarker(char))
    .join("");
}

/** 按指定编码将文本编码为字节并附带十六进制表示。 */
function encodeText(text, encoding) {
  const bytes = Buffer.from(iconv.encode(text, encoding));
  return {
    bytes,
    byteLength: bytes.length,
    bytesHex: toHexPairs(bytes),
  };
}

/** 按指定编码解码字节并整理多种可读形式。 */
function decodeText(bytes, encoding) {
  const text = iconv.decode(bytes, encoding);
  return {
    text,
    visibleText: toVisibleText(text),
    visiblePortion: getVisibleChars(text),
    unicodeEscapes: toUnicodeEscapes(text),
  };
}

/** 将错读结果中的可见部分重新编码后回转到源编码查看。 */
function reverseVisiblePortion(text, sourceEncoding = "big5", targetEncoding = "gbk") {
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

/** 将文本按源编码写入并按目标编码错读，返回完整分析结果。 */
function convertText(text, sourceEncoding = "big5", targetEncoding = "gbk") {
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

/** 输出一组示例文本在不同编码读写下的对照报告。 */
function printExampleReport(items, sourceEncoding = "big5", targetEncoding = "gbk") {
  const results = items.map((item) => convertText(item, sourceEncoding, targetEncoding));
  results.forEach((item) => {
    console.log(`[${item.originalLabel}]`);
    console.log(`原文（自动转繁体后按 ${sourceEncoding} 写入）: ${item.sourceText}`);
    console.log(`字节: ${item.bytesHex}`);
    console.log(
      `按 ${targetEncoding} 错读（完整）: ${item.target.visibleText}`,
    );
    console.log(
      `按 ${targetEncoding} 错读（可见部分）: ${item.target.visiblePortion}`,
    );
    if (item.visiblePortionRoundTrip) {
      console.log(
        `可见部分按 ${targetEncoding} 写回再按 ${sourceEncoding} 读取: ${item.visiblePortionRoundTrip.source.visibleText}`,
      );
    } else {
      console.log("可见部分回转结果: 无");
    }
    console.log(
      `按 ${targetEncoding} 错读（码点）: ${item.target.unicodeEscapes}`,
    );
    console.log("");
  });
}

if (require.main === module) {
  printExampleReport(examples);
}

module.exports = {
  encodeText,
  decodeText,
  convertText,
  printExampleReport,
};

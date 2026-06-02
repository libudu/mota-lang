import type { ConversionResult } from "@/utils/motaConverter";

type ResultPanelProps = {
  result: ConversionResult | null;
};

const PLACEHOLDER = "暂无内容";

export default function ResultPanel({ result }: ResultPanelProps) {
  const items = [
    {
      title: "繁体写入文本",
      value: result?.sourceText ?? "",
    },
    {
      title: "魔塔语可见部分",
      value: result?.target.visiblePortion ?? "",
    },
    {
      title: "错读完整结果",
      value: result?.target.visibleText ?? "",
      mono: true,
    },
    {
      title: "Unicode 码点",
      value: result?.target.unicodeEscapes ?? "",
      mono: true,
    },
    {
      title: "Big5 字节流",
      value: result?.bytesHex ?? "",
      mono: true,
    },
    {
      title: "可见部分回转",
      value: result?.visiblePortionRoundTrip?.source.visibleText ?? "",
      mono: true,
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
            Result
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
            魔塔语转换结果
          </h2>
        </div>
        <div className="text-sm text-zinc-400">
          共 {result?.byteLength ?? 0} 字节
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 space-y-3">
        {items.map((item) => (
          <section
            key={item.title}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
          >
            <h3 className="text-sm font-medium text-zinc-100">{item.title}</h3>
            <div
              className={[
                "mt-3 break-words rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100",
                item.mono
                  ? "font-mono text-sm leading-7"
                  : "text-base leading-7",
              ].join(" ")}
            >
              {item.value || PLACEHOLDER}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

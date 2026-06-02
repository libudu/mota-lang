import type { ConversionResult } from "@/utils/motaConverter";

type ResultPanelProps = {
  result: ConversionResult | null;
};

const PLACEHOLDER = "暂无内容";

export default function ResultPanel({ result }: ResultPanelProps) {
  const items = [
    {
      title: "魔塔语结果",
      value: result?.target.visiblePortion ?? "",
      theme: 'primary',
    },
    {
      title: "繁体文本",
      value: result?.sourceText ?? "",
    },
    {
      title: "Unicode 码点",
      value: result?.target.unicodeEscapes ?? "",
    },
    {
      title: "Big5 字节流",
      value: result?.bytesHex ?? "",
    },
    {
      title: "完整结果",
      value: result?.target.visibleText ?? "",
    },
    {
      title: "转回繁体",
      value: result?.visiblePortionRoundTrip?.source.visibleText ?? "",
    },
  ];
  const primaryItem = items.find((item) => item.theme === "primary");
  const secondaryItems = items.filter((item) => item.theme !== "primary");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <p className="text-base uppercase tracking-[0.28em] text-zinc-500">
            Result
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
            魔塔语转换结果
          </h2>
        </div>
      </div>

      {primaryItem ? (
        <section className="mt-4 flex items-baseline gap-4 rounded-xl border border-sky-300 bg-zinc-950/60 px-4 py-3 font-mono text-base leading-7 text-sky-300">
          <h3 className="shrink-0 font-bold">{primaryItem.title}</h3>
          <div className="min-w-0 flex-1 break-all font-bold">
            {primaryItem.value || PLACEHOLDER}
          </div>
        </section>
      ) : null}

      <div className={`mt-4 grid gap-3 ${result?.sourceText?.length > 20 ? "grid-cols-1" : "grid-cols-2"}`}>
        {secondaryItems.map((item) => (
          <section
            key={item.title}
            className="flex items-baseline gap-4 rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 font-mono text-base leading-7"
          >
            <h3 className="shrink-0 text-gray-400">{item.title}</h3>
            <div className="min-w-0 flex-1 break-all text-gray-400">
              {item.value || PLACEHOLDER}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

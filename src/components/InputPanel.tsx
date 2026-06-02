import { useEffect } from "react";

type InputPanelProps = {
  input: string;
  error: string;
  examples: readonly string[];
  onInputChange: (value: string) => void;
  onPickExample: (value: string) => void;
};

export default function InputPanel({
  input,
  error,
  examples,
  onInputChange,
  onPickExample,
}: InputPanelProps) {
  useEffect(() => {
    onInputChange('魔塔')
  }, [])

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <p className="text-base uppercase tracking-[0.28em] text-zinc-500">
          Mota Converter
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
          魔塔语转换器
        </h2>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        输入普通中文，前端会先转繁体，再按 Big5 写入并用 GBK
        错读，生成对应的魔塔语结果。
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <label className="text-base font-medium text-sky-300">
            输入文本
          </label>
        </div>
        <input
          id="mota-input"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="例如：绿色史莱姆、锁匙、魔塔"
          className="mt-3 h-11 w-full rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 text-sm text-sky-50 shadow-[0_0_0_1px_rgba(14,165,233,0.12)] outline-none transition placeholder:text-sky-200/35 focus:border-sky-400 focus:bg-sky-500/15 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.18)]"
        />
      </div>

      <div className="mt-5">
        <p className="text-base uppercase tracking-[0.24em] text-zinc-500">
          经典原文
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPickExample(example)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {example}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}
    </section>
  );
}

type InputPanelProps = {
  input: string
  error: string
  charCount: number
  examples: readonly string[]
  onInputChange: (value: string) => void
  onPickExample: (value: string) => void
}

export default function InputPanel({
  input,
  error,
  charCount,
  examples,
  onInputChange,
  onPickExample,
}: InputPanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Mota Converter</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-50">输入文本</h2>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        输入普通中文，前端会先转繁体，再按 Big5 写入并用 GBK 错读，生成对应的魔塔语结果。
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="mota-input" className="text-sm text-zinc-200">
            原文
          </label>
          <span className="text-xs text-zinc-500">{charCount} 个字符</span>
        </div>
        <input
          id="mota-input"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="例如：绿色史莱姆、锁匙、魔塔"
          className="mt-3 h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
        />
      </div>

      <p className="mt-3 text-xs text-zinc-500">输入时会立即转换结果。</p>

      <div className="mt-5 flex flex-wrap gap-2">
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
  )
}

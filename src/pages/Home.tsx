import { useMemo } from "react";
import InputPanel from "@/components/InputPanel";
import ResultPanel from "@/components/ResultPanel";
import { useConverterStore } from "@/store/useConverterStore";
import { EXAMPLE_INPUTS } from "@/utils/motaConverter";

export default function Home() {
  const { input, result, error, setInput, applyExample } = useConverterStore();

  const charCount = useMemo(() => Array.from(input).length, [input]);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6">
          <p className="text-sm text-zinc-400">中文转魔塔语编码错读工具</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-50">
            简洁版转换面板
          </h1>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <InputPanel
            input={input}
            error={error}
            charCount={charCount}
            examples={EXAMPLE_INPUTS}
            onInputChange={setInput}
            onPickExample={applyExample}
          />
          <ResultPanel result={result} />
        </section>
      </div>
    </main>
  );
}

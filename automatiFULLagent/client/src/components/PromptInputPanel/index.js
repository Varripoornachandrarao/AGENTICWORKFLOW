import { WandSparkles } from "lucide-react";
import { useState } from "react";

export default function PromptInputPanel({ onGenerate, isLoading, provider }) {
  const [prompt, setPrompt] = useState(
    "When an invoice email arrives, extract invoice details, append them to Google Sheets, and notify Slack."
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-line bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={3}
          className="resize-none rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-teal-100"
          placeholder="Describe the automation you want to build"
        />
        <button
          type="submit"
          disabled={isLoading || prompt.trim().length < 8}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <WandSparkles size={16} />
          {isLoading ? "Generating" : "Generate"}
        </button>
      </div>
      {provider ? <p className="mt-2 text-xs text-slate-500">Generated with {provider}.</p> : null}
    </form>
  );
}

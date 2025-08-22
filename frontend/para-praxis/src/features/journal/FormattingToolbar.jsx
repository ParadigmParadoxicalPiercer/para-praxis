import React from "react";

// Compact formatting toolbar for the markdown editor
export function FormattingToolbar({ applyWrap, applyPrefixLine }) {
  const Btn = ({ label, onClick, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title || label}
      className="px-2 py-1 text-[11px] rounded bg-slate-700 hover:bg-slate-600"
    >
      {label}
    </button>
  );

  return (
    <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 flex flex-wrap gap-1 text-slate-300 text-[11px]">
      <Btn label="B" onClick={() => applyWrap("**", "**", "bold")} title="Bold (Cmd/Ctrl+B)" />
      <Btn label="I" onClick={() => applyWrap("_", "_", "italic")} title="Italic (Cmd/Ctrl+I)" />
      <Btn label="H2" onClick={() => applyPrefixLine("## ")} title="Toggle H2 heading" />
      <Btn label="H3" onClick={() => applyPrefixLine("### ")} title="Toggle H3 heading" />
      <Btn label="•" onClick={() => applyPrefixLine("- ")} title="Toggle bullet line" />
      <Btn label="1." onClick={() => applyPrefixLine("1. ")} title="Toggle ordered list start" />
      <Btn label="[]" onClick={() => applyPrefixLine("- [ ] ")} title="Checkbox task" />
      <Btn label=">" onClick={() => applyPrefixLine("> ")} title="Quote line" />
      <Btn label="`code`" onClick={() => applyWrap("`", "`", "code")} title="Inline code" />
      <Btn label="CodeBlk" onClick={() => applyWrap("```\n", "\n```", "code block")} title="Code block" />
      <Btn label="HR" onClick={() => applyWrap("\n---\n", "", "")} title="Horizontal rule" />
    </div>
  );
}

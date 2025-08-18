import { useEffect, useCallback, useState, useRef } from "react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useJournalsStore } from "../stores/useJournalsStore";

// Reusable guided templates (organized, actionable prompts)
const JOURNAL_TEMPLATES = [
  {
    key: "daily",
    label: "Daily Reflection",
    title: "Daily Reflection",
    content: `# Daily Reflection\n\n**How do I feel today?**\n- \n\n**What did I do? (key activities / progress)**\n- \n\n**What problem(s) did I come across?**\n- \n\n**How did I approach / fix it?**\n- \n\n**What worked? What didn't?**\n- Worked: \n- Didn't: \n\n**What will I do next? (1–3 concrete next steps)**\n1. \n2. \n3. \n\n**Gratitude (optional)**\n- \n\n**Other notes / ideas**\n- `,
  },
  {
    key: "problem",
    label: "Problem Solving",
    title: "Problem-Solving Log",
    content: `# Problem-Solving Log\n\n**Problem Statement**\n- \n\n**Context / Impact**\n- \n\n**Hypotheses / Possible Causes**\n- \n\n**Attempts & Experiments**\n- Attempt 1: (what / result)\n- Attempt 2: (what / result)\n\n**Outcome / Fix**\n- \n\n**What I Learned**\n- \n\n**Preventive Action / Follow-up**\n- `,
  },
  {
    key: "mood",
    label: "Mood Check-In",
    title: "Mood Check-In",
    content: `# Mood Check-In\n\n**Current Mood (1–10 + descriptor)**\n- \n\n**Energy Level**\n- \n\n**Emotions Present**\n- \n\n**What contributed to this?**\n- \n\n**What helped / could help?**\n- \n\n**One intention for the rest of the day**\n- \n`,
  },
  {
    key: "achieve",
    label: "Wins & Gratitude",
    title: "Wins & Gratitude",
    content: `# Wins & Gratitude\n\n**Top 3 Wins / Achievements**\n1. \n2. \n3. \n\n**Challenges I Overcame**\n- \n\n**People / Tools that Helped**\n- \n\n**Grateful For**\n- \n\n**Next Small Step**\n- \n`,
  },
];

export default function JournalPage() {
  const {
    load,
    journals,
    selectedId,
    select,
    create,
    update,
    remove,
    setSearch,
    search,
    selected,
    hasNext,
    load: loadMore,
    saving,
  } = useJournalsStore();
  const current = selected();
  const [draft, setDraft] = useState({ title: "", content: "" });
  const [dirty, setDirty] = useState(false);
  const [titleError, setTitleError] = useState(false);
  // Prevent duplicate missing-title toasts within the same invalid state
  const [titleErrorToastShown, setTitleErrorToastShown] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [inserting, setInserting] = useState(false);
  const textareaRef = useRef(null);
  const [preview, setPreview] = useState(false);
  // Close template dropdown if switching to preview
  useEffect(() => {
    if (preview && showTemplates) setShowTemplates(false);
  }, [preview, showTemplates]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (current) {
      setDraft({ title: current.title, content: current.content || "" });
      setDirty(false);
    }
  }, [current]);

  // Save handler (placed before keyboard effect to avoid TDZ issues)
  const doSave = useCallback(async () => {
    if (!current) return;
    const titleTrimmed = (draft.title || "").trim();
    if (!titleTrimmed) {
      // Client-side guard: avoid hitting API and give clearer feedback
      setTitleError(true);
      if (!titleErrorToastShown) {
        toast.error("Please enter a title");
        setTitleErrorToastShown(true);
      }
      // focus title input
      requestAnimationFrame(() => {
        const titleInput = document.querySelector('input[placeholder="Title"]');
        titleInput && titleInput.focus();
      });
      return;
    }
    try {
      await update(current.id, draft);
      setDirty(false);
      setTitleError(false);
      setTitleErrorToastShown(false);
    } catch {
      if (!(draft.title || "").trim()) setTitleError(true);
      // optionally log for debugging
      // console.debug('Save error', e);
    }
  }, [current, draft, update, titleErrorToastShown]);

  // Keyboard save (Cmd/Ctrl+S)
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (current && dirty) doSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, dirty, doSave]);

  const onField = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setDirty(true);
    if (field === "title") {
      if ((value || "").trim().length > 0) {
        setTitleError(false);
        setTitleErrorToastShown(false);
      }
    }
  };

  const createAndFocus = async () => {
    const newEntry = await create({ title: "Untitled", content: "" });
    setPreview(false); // ensure in edit mode
    // prepare draft (store already has it, but we ensure dirty = false so initial save not forced)
    if (newEntry) {
      setDraft({ title: newEntry.title, content: newEntry.content || "" });
      setDirty(false);
      // focus title after render
      requestAnimationFrame(() => {
        const titleInput = document.querySelector('input[placeholder="Title"]');
        titleInput && titleInput.focus();
        titleInput && titleInput.select();
      });
    }
  };

  const applyTemplate = (tpl) => {
    if (!tpl) return;
    // If there is meaningful existing content, confirm before overwriting
    const existingHasContent =
      (draft.content?.trim() || "").length > 10 ||
      (draft.title?.trim() || "").length > 0;
    if (existingHasContent && !confirm("Replace current draft with template?"))
      return;
    setInserting(true);
    setDraft({ title: tpl.title, content: tpl.content });
    setDirty(true); // mark dirty so user can save
    setShowTemplates(false);
    setTimeout(() => setInserting(false), 150); // minor UX flag reset
  };

  const appendTemplate = (tpl) => {
    if (!tpl) return;
    setInserting(true);
    setDraft((d) => ({
      title: d.title || tpl.title,
      content: (d.content ? d.content + "\n\n" : "") + tpl.content,
    }));
    setDirty(true);
    setShowTemplates(false);
    setTimeout(() => setInserting(false), 150);
  };

  // --- Formatting Helpers ---
  const applyWrap = (before, after = before, placeholder = "text") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = draft.content || "";
    const selected = value.slice(start, end) || placeholder;
    const newText =
      value.slice(0, start) + before + selected + after + value.slice(end);
    const cursorPos = start + before.length + selected.length + after.length;
    setDraft((d) => ({ ...d, content: newText }));
    setDirty(true);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorPos - after.length, cursorPos - after.length); // place caret inside if placeholder
    });
  };

  const applyPrefixLine = (prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const value = draft.content || "";
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndIdx = value.indexOf("\n", start);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const line = value.slice(lineStart, lineEnd);
    const hasPrefix = line.startsWith(prefix);
    const newLine = hasPrefix ? line.replace(prefix, "") : prefix + line;
    const newText = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
    setDraft((d) => ({ ...d, content: newText }));
    setDirty(true);
    requestAnimationFrame(() => {
      el.focus();
      const offsetDelta = newLine.length - line.length;
      el.setSelectionRange(start + offsetDelta, start + offsetDelta);
    });
  };

  const handleKeyDown = (e) => {
    // Formatting shortcuts
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      applyWrap("**", "**", "bold");
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      applyWrap("_", "_", "italic");
      return;
    }
    // Auto bullet continuation
    if (e.key === "Enter") {
      const el = textareaRef.current;
      if (!el) return;
      const pos = el.selectionStart;
      const value = draft.content || "";
      const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
      const line = value.slice(lineStart, pos);
      const bulletMatch = line.match(/^(\s*)([-*+] )/);
      const olMatch = line.match(/^(\s*)(\d+)\. /);
      if (bulletMatch || olMatch) {
        e.preventDefault();
        let insert = "\n";
        if (bulletMatch) {
          const contentAfterBullet = line.slice(bulletMatch[0].length).trim();
          if (contentAfterBullet.length === 0) {
            // Empty bullet -> remove bullet (exit list)
            const newLine = value.slice(0, lineStart) + value.slice(pos);
            setDraft((d) => ({ ...d, content: newLine }));
            setDirty(true);
            requestAnimationFrame(() => {
              el.focus();
              el.setSelectionRange(lineStart, lineStart);
            });
            return;
          } else {
            insert += bulletMatch[1] + bulletMatch[2];
          }
        } else if (olMatch) {
          const after = line.slice(olMatch[0].length).trim();
          if (after.length === 0) {
            // remove numbering if empty line
            const newLine = value.slice(0, lineStart) + value.slice(pos);
            setDraft((d) => ({ ...d, content: newLine }));
            setDirty(true);
            requestAnimationFrame(() => {
              el.focus();
              el.setSelectionRange(lineStart, lineStart);
            });
            return;
          } else {
            const nextNum = parseInt(olMatch[2], 10) + 1;
            insert += olMatch[1] + nextNum + ". ";
          }
        }
        const newText = value.slice(0, pos) + insert + value.slice(pos);
        setDraft((d) => ({ ...d, content: newText }));
        setDirty(true);
        const newPos = pos + insert.length;
        requestAnimationFrame(() => {
          el.focus();
          el.setSelectionRange(newPos, newPos);
        });
      }
    }
  };

  const toolbarBtn = (label, onClick, title) => (
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
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-800 flex flex-col">
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Search..."
              className="flex-1 bg-slate-900 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
            />
            <button
              onClick={createAndFocus}
              className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 rounded"
            >
              New
            </button>
          </div>
          <button
            onClick={() => load()}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Refresh
          </button>
        </div>
        <div className="flex-1 overflow-y-auto text-sm">
          {journals.map((j) => (
            <button
              key={j.id}
              onClick={() => select(j.id)}
              className={`block w-full text-left px-3 py-2 border-b border-slate-900 hover:bg-slate-900 ${
                j.id === selectedId ? "bg-slate-900/70" : ""
              }`}
            >
              <div className="font-medium truncate">
                {j.title || "Untitled"}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {(j.content || "").replace(/\n/g, " ")}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {new Date(j.updatedAt).toLocaleString()}
              </div>
            </button>
          ))}
          {hasNext && (
            <div className="p-3">
              <button
                onClick={() => loadMore(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 rounded py-1 text-xs"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {!current && (
          <div className="m-auto text-center text-slate-400">
            <p className="mb-4">No journal selected</p>
            <button
              onClick={createAndFocus}
              className="bg-indigo-600 px-4 py-2 rounded"
            >
              Create your first entry
            </button>
          </div>
        )}
        {current && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex gap-2 relative">
              <input
                value={draft.title}
                onChange={(e) => onField("title", e.target.value)}
                onBlur={() => dirty && doSave()}
                placeholder="Title"
                className={`flex-1 bg-transparent text-2xl font-semibold focus:outline-none border-b transition-colors ${
                  titleError
                    ? "border-red-600 focus:border-red-500"
                    : "border-transparent focus:border-indigo-500"
                }`}
              />
              <div className="flex items-center gap-2">
                <div className="relative">
                  {!preview ? (
                    <button
                      type="button"
                      onClick={() => setShowTemplates((v) => !v)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                    >
                      Guided Prompts
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Switch to Edit mode to use guided prompts"
                      className="text-xs bg-slate-800 text-slate-500 px-3 py-1 rounded cursor-not-allowed"
                    >
                      Guided Prompts
                    </button>
                  )}
                  {showTemplates && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded shadow-lg z-10 text-left">
                      <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-700">
                        Insert Template
                      </div>
                      <ul className="max-h-72 overflow-y-auto text-sm">
                        {JOURNAL_TEMPLATES.map((t) => (
                          <li
                            key={t.key}
                            className="border-b border-slate-700 last:border-b-0"
                          >
                            <div className="px-3 py-2 hover:bg-slate-700/60">
                              <div className="font-medium text-slate-100 text-[13px] mb-1">
                                {t.label}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => applyTemplate(t)}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded px-2 py-1 text-[11px]"
                                >
                                  Replace
                                </button>
                                <button
                                  onClick={() => appendTemplate(t)}
                                  className="flex-1 bg-slate-600 hover:bg-slate-500 rounded px-2 py-1 text-[11px]"
                                >
                                  Append
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="p-2 text-[10px] text-slate-500 border-t border-slate-700">
                        Choose a template to structure your thoughts. Replace
                        overwrites; Append adds to bottom.
                      </div>
                    </div>
                  )}
                </div>
                {dirty && (
                  <span className="text-xs text-amber-400">Unsaved</span>
                )}
                {saving && (
                  <span className="text-xs text-slate-400 animate-pulse">
                    Saving...
                  </span>
                )}
                {inserting && (
                  <span className="text-xs text-indigo-300 animate-pulse">
                    Template inserted
                  </span>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    if (!preview && dirty) await doSave();
                    setPreview((p) => !p);
                  }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
                >
                  {preview ? "Edit" : "Preview"}
                </button>
                <button
                  onClick={() => doSave()}
                  disabled={!dirty}
                  className="text-xs bg-indigo-600 disabled:opacity-40 px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => remove(current.id)}
                  className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            {!preview && (
              <textarea
                value={draft.content}
                onChange={(e) => onField("content", e.target.value)}
                onBlur={() => dirty && doSave()}
                onKeyDown={handleKeyDown}
                ref={textareaRef}
                className="flex-1 p-4 bg-transparent resize-none focus:outline-none leading-relaxed"
                placeholder="Start writing..."
              />
            )}
            {preview && (
              <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-pre:bg-slate-900/70 prose-code:bg-slate-800/60 prose-code:px-1 prose-code:py-0.5 prose-li:my-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ ...props }) => (
                      <h1
                        className="mt-0 mb-4 text-3xl border-b border-slate-700 pb-2"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="mt-8 mb-3 text-2xl border-b border-slate-800 pb-1"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="mt-6 mb-2 text-xl" {...props} />
                    ),
                    code: ({ inline, children, ...props }) => {
                      return !inline ? (
                        <pre
                          className="rounded-md p-3 text-sm overflow-x-auto bg-slate-900/80"
                          {...props}
                        >
                          <code>{children}</code>
                        </pre>
                      ) : (
                        <code
                          className="rounded bg-slate-800/60 px-1 py-0.5"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-indigo-500/60 pl-4 italic bg-slate-900/40 py-1"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="list-disc pl-6 space-y-1" {...props} />
                    ),
                    ol: ({ ...props }) => (
                      <ol className="list-decimal pl-6 space-y-1" {...props} />
                    ),
                    li: ({ ...props }) => (
                      <li className="marker:text-indigo-400" {...props} />
                    ),
                    hr: () => <hr className="my-6 border-slate-700" />,
                    a: ({ ...props }) => (
                      <a
                        className="text-indigo-400 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {draft.content || "*Nothing to preview yet...*"}
                </ReactMarkdown>
              </div>
            )}
            {/* Formatting Toolbar (hidden in preview) */}
            {current && !preview && (
              <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/40 flex flex-wrap gap-1 text-slate-300 text-[11px]">
                {toolbarBtn(
                  "B",
                  () => applyWrap("**", "**", "bold"),
                  "Bold (Cmd/Ctrl+B)"
                )}
                {toolbarBtn(
                  "I",
                  () => applyWrap("_", "_", "italic"),
                  "Italic (Cmd/Ctrl+I)"
                )}
                {toolbarBtn(
                  "H2",
                  () => applyPrefixLine("## "),
                  "Toggle H2 heading"
                )}
                {toolbarBtn(
                  "H3",
                  () => applyPrefixLine("### "),
                  "Toggle H3 heading"
                )}
                {toolbarBtn(
                  "•",
                  () => applyPrefixLine("- "),
                  "Toggle bullet line"
                )}
                {toolbarBtn(
                  "1.",
                  () => applyPrefixLine("1. "),
                  "Toggle ordered list start"
                )}
                {toolbarBtn(
                  "[]",
                  () => applyPrefixLine("- [ ] "),
                  "Checkbox task"
                )}
                {toolbarBtn(">", () => applyPrefixLine("> "), "Quote line")}
                {toolbarBtn(
                  "`code`",
                  () => applyWrap("`", "`", "code"),
                  "Inline code"
                )}
                {toolbarBtn(
                  "CodeBlk",
                  () => applyWrap("```\n", "\n```", "code block"),
                  "Code block"
                )}
                {toolbarBtn(
                  "HR",
                  () => applyWrap("\n---\n", "", ""),
                  "Horizontal rule"
                )}
              </div>
            )}
            <div className="text-[11px] text-slate-500 px-4 py-2 border-t border-slate-800 flex justify-between">
              <span>
                {preview
                  ? "Preview mode"
                  : dirty
                  ? "Unsaved changes"
                  : "All changes saved"}
                {" • "}
                {draft.content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>
                {preview ? "Toggle Edit to modify" : "Cmd/Ctrl+S to save"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

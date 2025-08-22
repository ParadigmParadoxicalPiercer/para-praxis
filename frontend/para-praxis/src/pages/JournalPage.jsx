import { useEffect, useState, useRef } from "react";
import { useJournalsStore } from "../stores/useJournalsStore";
// New: modular pieces to keep this page readable
import { useJournalEditor } from "../features/journal/useJournalEditor";
import { JournalSidebar } from "../features/journal/JournalSidebar";
import { JournalPreview } from "../features/journal/JournalPreview";
import { JournalHeader } from "../features/journal/JournalHeader";
import { TemplateDropdown } from "../features/journal/TemplateDropdown";
import { FormattingToolbar } from "../features/journal/FormattingToolbar";

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
  // Editor state + save logic lives in a small hook now
  const {
    draft,
    setDraft,
    dirty,
    setDirty,
  titleError,
    textareaRef,
    doSave,
    onField,
  } = useJournalEditor({ current, update });
  const [showTemplates, setShowTemplates] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [preview, setPreview] = useState(false);
  const dropdownRef = useRef(null);
  // Close template dropdown if switching to preview
  useEffect(() => {
    if (preview && showTemplates) setShowTemplates(false);
  }, [preview, showTemplates]);

  // Close templates on click-outside or ESC
  useEffect(() => {
    if (!showTemplates) return;
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTemplates(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setShowTemplates(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [showTemplates]);

  useEffect(() => {
    load();
  }, [load]);

  // Tip to future-me: keyboard shortcut lives here (hook keeps the actual save logic)

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

  // Toolbar moved to its own component for clarity

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar moved into a component so I can focus on editor logic here */}
      <JournalSidebar
        search={search}
        setSearch={setSearch}
        onRefresh={load}
        onCreate={createAndFocus}
        journals={journals}
        selectedId={selectedId}
        select={select}
        hasNext={hasNext}
        loadMore={loadMore}
      />

      {/* Editor */}
  <div className="flex-1 flex flex-col min-h-[60vh] md:min-h-0">
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
            <JournalHeader
              title={draft.title}
              onTitle={(v) => onField("title", v)}
              onSave={doSave}
              onDelete={() => remove(current.id)}
              dirty={dirty}
              saving={saving}
              inserting={inserting}
              preview={preview}
              setPreview={setPreview}
              setShowTemplates={setShowTemplates}
              titleError={titleError}
            />
            {showTemplates && (
              <div className="relative z-40" ref={dropdownRef}>
                <div className="absolute right-4 top-2">
                  <TemplateDropdown onReplace={applyTemplate} onAppend={appendTemplate} />
                </div>
              </div>
            )}
            {!preview ? (
              <>
                <textarea
                  value={draft.content}
                  onChange={(e) => onField("content", e.target.value)}
                  onBlur={() => dirty && doSave()}
                  onKeyDown={handleKeyDown}
                  ref={textareaRef}
                  className="flex-1 p-4 bg-transparent resize-none focus:outline-none leading-relaxed"
                  placeholder="Start writing..."
                />
                <FormattingToolbar
                  applyWrap={applyWrap}
                  applyPrefixLine={applyPrefixLine}
                />
              </>
            ) : (
              <JournalPreview content={draft.content} />
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

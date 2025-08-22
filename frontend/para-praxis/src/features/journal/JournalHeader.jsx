import React from "react";

// Editor header: title input + actions + template dropdown toggle
export function JournalHeader({
  title,
  onTitle,
  onSave,
  onDelete,
  dirty,
  saving,
  inserting,
  preview,
  setPreview,
  setShowTemplates,
  titleError,
}) {
  return (
    <div className="p-4 border-b border-slate-800 flex gap-2 relative">
      <input
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        onBlur={() => dirty && onSave()}
        placeholder="Title"
        className={`flex-1 bg-transparent text-2xl font-semibold focus:outline-none border-b transition-colors ${
          titleError ? "border-red-600 focus:border-red-500" : "border-transparent focus:border-indigo-500"
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
        </div>
        {dirty && <span className="text-xs text-amber-400">Unsaved</span>}
        {saving && <span className="text-xs text-slate-400 animate-pulse">Saving...</span>}
        {inserting && <span className="text-xs text-indigo-300 animate-pulse">Template inserted</span>}
        <button
          type="button"
          onClick={async () => {
            if (!preview && dirty) await onSave();
            setPreview((p) => !p);
          }}
          className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded"
        >
          {preview ? "Edit" : "Preview"}
        </button>
        <button onClick={() => onSave()} disabled={!dirty} className="text-xs bg-indigo-600 disabled:opacity-40 px-3 py-1 rounded">
          Save
        </button>
        <button onClick={onDelete} className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded">
          Delete
        </button>
      </div>
    </div>
  );
}

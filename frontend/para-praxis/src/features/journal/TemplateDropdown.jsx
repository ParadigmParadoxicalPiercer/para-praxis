import React from "react";
import { JOURNAL_TEMPLATES } from "./templates";

// Small dropdown menu that lists templates with Replace/Append actions and a fade/scale transition
export function TemplateDropdown({ onReplace, onAppend }) {
  return (
    <div
      className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded shadow-lg z-10 text-left transition-all duration-200 ease-out"
      style={{
        transform: "scale(0.96)",
        opacity: 0.7,
        animation: "dropdownIn 0.18s cubic-bezier(.4,0,.2,1) forwards"
      }}
    >
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-700">Insert Template</div>
      <ul className="max-h-72 overflow-y-auto text-sm">
        {JOURNAL_TEMPLATES.map((t) => (
          <li key={t.key} className="border-b border-slate-700 last:border-b-0">
            <div className="px-3 py-2 hover:bg-slate-700/60">
              <div className="font-medium text-slate-100 text-[13px] mb-1">{t.label}</div>
              <div className="flex gap-2">
                <button onClick={() => onReplace(t)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 rounded px-2 py-1 text-[11px]">
                  Replace
                </button>
                <button onClick={() => onAppend(t)} className="flex-1 bg-slate-600 hover:bg-slate-500 rounded px-2 py-1 text-[11px]">
                  Append
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-2 text-[10px] text-slate-500 border-t border-slate-700">
        Choose a template to structure your thoughts. Replace overwrites; Append adds to bottom.
      </div>
    </div>
  );
}

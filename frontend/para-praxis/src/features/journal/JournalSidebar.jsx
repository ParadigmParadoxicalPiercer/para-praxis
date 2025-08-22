import React from "react";

// Sidebar: shows search, create, refresh, and the journal list
export function JournalSidebar({
  search,
  setSearch,
  onRefresh,
  onCreate,
  journals,
  selectedId,
  select,
  hasNext,
  loadMore,
}) {
  return (
    <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col">
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRefresh()}
            placeholder="Search..."
            className="flex-1 bg-slate-900 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <button onClick={onCreate} className="bg-indigo-600 hover:bg-indigo-500 text-sm px-3 rounded">
            New
          </button>
        </div>
        <button onClick={onRefresh} className="text-xs text-slate-400 hover:text-slate-200">
          Refresh
        </button>
      </div>
      <div className="flex-1 overflow-y-auto text-sm max-h-[40vh] md:max-h-none">
        {journals.map((j) => (
          <button
            key={j.id}
            onClick={() => select(j.id)}
            className={`block w-full text-left px-3 py-2 border-b border-slate-900 hover:bg-slate-900 ${
              j.id === selectedId ? "bg-slate-900/70" : ""
            }`}
          >
            <div className="font-medium truncate">{j.title || "Untitled"}</div>
            <div className="text-[11px] text-slate-400 truncate">{(j.content || "").replace(/\n/g, " ")}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {new Date(j.updatedAt).toLocaleString()}
            </div>
          </button>
        ))}
        {hasNext && (
          <div className="p-3">
            <button onClick={() => loadMore(true)} className="w-full bg-slate-800 hover:bg-slate-700 rounded py-1 text-xs">
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

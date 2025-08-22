// Tasks dashboard: loads tasks via store, filters, and renders form/list with themed left panel.
import React, { useEffect, useState } from "react";
import { useTasksStore } from "../stores/useTasksStore";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";

export default function TasksPage() {
  const { load, loading, tasks, filter, setFilter } = useTasksStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, [filter.status, load]);

  return (
    <div className="flex-1 relative w-full flex overflow-hidden items-stretch">
      {/* Background image */}
      <img
        src="/todo-list.png"
        alt="Tasks Background"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/70 to-white/0 z-10 pointer-events-none" />
      <div className="relative z-20 flex flex-col md:flex-row w-full items-stretch">
        {/* Left Athena Inspiration */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight">
              STRATEGY
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-600 mb-20 tracking-tight">
              AND ACTION
            </h2>
            <p className="text-xl sm:text-2xl text-blue-700 font-semibold leading-relaxed mt-48 mb-8">
              "Wisdom is knowing what to do next; skill is knowing how; virtue
              is doing it."
            </p>
            <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
              <p className="text-slate-700 text-lg leading-relaxed">
                Invoke the clarity of{" "}
                <span className="text-blue-700 font-semibold">Athena</span>.
                Plan with intent, prioritize with discipline, and execute with
                calm precision.
              </p>
            </div>
          </div>
        </div>
        {/* Right Tasks Manager Panel */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-10">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>
              <button
                onClick={() => setShowForm((s) => !s)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              >
                {showForm ? "Close" : "New Task"}
              </button>
            </div>
            {showForm && <TaskForm onCreated={() => setShowForm(false)} />}
            <div className="flex gap-3 my-4">
              {["all", "active", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter({ status: s })}
                  className={`px-3 py-1 rounded border text-sm font-medium ${
                    filter.status === s
                      ? "bg-blue-600 text-white border-blue-700"
                      : "bg-white text-slate-600 border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
              {loading ? <div>Loading...</div> : <TaskList tasks={tasks} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

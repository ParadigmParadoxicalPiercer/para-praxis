import React, { useState } from "react";
import { useTasksStore } from "../../stores/useTasksStore";

function formatDue(dueDate) {
  if (!dueDate) return "—";
  const d = new Date(dueDate);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function priorityBadge(p) {
  const map = { 1: "High", 2: "Normal", 3: "Low" };
  const colors = {
    1: "bg-red-100 text-red-700",
    2: "bg-yellow-100 text-yellow-700",
    3: "bg-slate-200 text-slate-600",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${colors[p]}`}>
      {map[p] || "?"}
    </span>
  );
}

export default function TaskList({ tasks }) {
  const { toggle, remove, update } = useTasksStore();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 2,
  });

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task.priority,
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
  };
  const saveEdit = async (id) => {
    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim() || undefined,
      dueDate: editForm.dueDate
        ? new Date(editForm.dueDate).toISOString()
        : null,
      priority: Number(editForm.priority),
    };
    await update(id, payload);
    setEditingId(null);
  };
  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };
  if (!tasks.length) return <div className="text-slate-500">No tasks yet.</div>;
  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const overdue =
          task.dueDate &&
          !task.completed &&
          new Date(task.dueDate) < new Date();
        return (
          <li
            key={task.id}
            className={`border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggle(task)}
                className="h-5 w-5 accent-blue-600 cursor-pointer mt-1.5"
              />
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={onEditChange}
                        className="flex-1 px-2 py-1 rounded border border-slate-300 text-sm"
                      />
                      <select
                        name="priority"
                        value={editForm.priority}
                        onChange={onEditChange}
                        className="px-2 py-1 rounded border border-slate-300 text-sm"
                      >
                        <option value={1}>High</option>
                        <option value={2}>Normal</option>
                        <option value={3}>Low</option>
                      </select>
                      <input
                        type="date"
                        name="dueDate"
                        value={editForm.dueDate}
                        onChange={onEditChange}
                        className="px-2 py-1 rounded border border-slate-300 text-sm"
                      />
                    </div>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={onEditChange}
                      className="px-2 py-1 rounded border border-slate-300 text-sm min-h-[60px]"
                      placeholder="Description"
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold text-lg ${
                            task.completed
                              ? "line-through text-slate-500"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {priorityBadge(task.priority)}
                        {task.dueDate && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              overdue
                                ? "bg-red-600 text-white"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {overdue ? "Overdue" : formatDue(task.dueDate)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {editingId !== task.id && (
                          <button
                            onClick={() => startEdit(task)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => remove(task.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">
                        {task.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

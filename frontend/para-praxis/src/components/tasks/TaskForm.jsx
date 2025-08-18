import React, { useState } from "react";
import { useTasksStore } from "../../stores/useTasksStore";

export default function TaskForm({ onCreated }) {
  const { add } = useTasksStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 2,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await add({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : undefined,
        priority: Number(form.priority),
      });
      setForm({ title: "", description: "", dueDate: "", priority: 2 });
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-3"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          className="flex-1 px-3 py-2 rounded border border-slate-300"
          required
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="px-3 py-2 rounded border border-slate-300"
        >
          <option value={1}>High</option>
          <option value={2}>Normal</option>
          <option value={3}>Low</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="px-3 py-2 rounded border border-slate-300"
        />
        <button
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </div>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        className="px-3 py-2 rounded border border-slate-300 min-h-[70px]"
      ></textarea>
    </form>
  );
}

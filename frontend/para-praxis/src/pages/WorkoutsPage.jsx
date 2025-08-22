// Brief: Workout templates picker, user presets, and plan management UI.
import React, { useEffect, useState } from "react";
import {
  listTemplates,
  createFromTemplate,
  listPlans,
  markExerciseComplete,
  markExerciseIncomplete,
} from "../services/workoutPlans.service";
import RestTimer from "../components/workouts/RestTimer";
import { addExercise as addExerciseApi } from "../services/workoutPlans.service";
import {
  listUserTemplates,
  createUserTemplate,
} from "../services/userTemplates.service";

const EQUIPMENT = [
  { label: "Bodyweight", value: "BODYWEIGHT" },
  { label: "Dumbbell", value: "DUMBBELL" },
  { label: "Gym", value: "GYM" },
];
const GOALS = [
  { label: "Lose weight", value: "LOSE_WEIGHT" },
  { label: "Fitness", value: "FITNESS" },
  { label: "Bulk", value: "BULK" },
  { label: "V-Taper", value: "V_TAPER" },
];

export default function WorkoutsPage() {
  const [equipment, setEquipment] = useState("BODYWEIGHT");
  const [goal, setGoal] = useState("FITNESS");
  const [templates, setTemplates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [userTemplates, setUserTemplates] = useState([]);

  const loadTemplates = async () => {
    const { data } = await listTemplates({ equipment, goal });
    setTemplates(data.data || []);
  };

  const loadPlans = async () => {
    const { data } = await listPlans({ limit: 100 });
    setPlans((data.data && data.data.workoutPlans) || []);
  };

  const loadUserTemplates = async () => {
    const { data } = await listUserTemplates();
    setUserTemplates(data.data || []);
  };

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment, goal]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadPlans();
  await loadUserTemplates();
      setLoading(false);
    })();
  }, []);

  const handleCreateFromTemplate = async (payload) => {
    setCreating(true);
    try {
      await createFromTemplate(payload);
      await loadPlans();
    } finally {
      setCreating(false);
    }
  };

  const toggleExercise = async (exercise) => {
    if (exercise.completed) await markExerciseIncomplete(exercise.id);
    else await markExerciseComplete(exercise.id);
    await loadPlans();
  };

  const [expandedCompleted, setExpandedCompleted] = useState({}); // planId -> bool
  const toggleCompletedSection = (planId) =>
    setExpandedCompleted((m) => ({ ...m, [planId]: !m[planId] }));

  const [newExercise, setNewExercise] = useState({}); // planId -> { name, reps, sets }
  const onAddExercise = async (planId) => {
    const form = newExercise[planId] || {};
    if (!form.name?.trim()) return;
    await addExerciseApi(planId, {
      name: form.name.trim(),
      reps: form.reps ? Number(form.reps) : undefined,
      sets: form.sets ? Number(form.sets) : undefined,
    });
    setNewExercise((s) => ({ ...s, [planId]: { name: "", reps: "", sets: "" } }));
    await loadPlans();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6">Workout Plans</h1>

        {/* Template Picker */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-slate-700">Equipment:</span>
              <select
                value={equipment}
                onChange={(e) => {
                  const next = e.target.value;
                  setEquipment(next);
                  if (next !== "GYM" && goal === "V_TAPER") {
                    setGoal("FITNESS");
                  }
                }}
                className="px-3 py-2 rounded border border-slate-300"
              >
                {EQUIPMENT.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-slate-700">Goal:</span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="px-3 py-2 rounded border border-slate-300"
              >
                {GOALS.map((opt) => {
                  const disabled = opt.value === "V_TAPER" && equipment !== "GYM";
                  return (
                    <option key={opt.value} value={opt.value} disabled={disabled}>
                      {opt.label}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* No separate Gym Type; V-Taper lives under Goal when Equipment=GYM */}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-blue-700">{tpl.name}</div>
                    <div className="text-sm text-slate-600">{tpl.description}</div>
                  </div>
                  <button
                    onClick={() => handleCreateFromTemplate(tpl.userTemplateId ? { userTemplateId: tpl.userTemplateId } : { templateId: tpl.id })}
                    disabled={creating}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded"
                  >
                    {creating ? "Creating..." : "Use Template"}
                  </button>
                </div>
                <ul className="mt-3 list-disc list-inside text-slate-700 text-sm">
                  {tpl.exercises.map((ex, idx) => (
                    <li key={idx}>
                      {ex.name} — {ex.sets || 0}x{ex.reps || ex.description || 0}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* User templates quick access */}
          {userTemplates.length > 0 && (
            <div className="mt-6">
              <div className="text-slate-700 font-semibold mb-2">Your Presets</div>
              <div className="grid md:grid-cols-2 gap-4">
                {userTemplates.map((tpl) => (
                  <div key={tpl.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-blue-700">{tpl.name}</div>
                        <div className="text-xs text-slate-500">{tpl.equipment} • {tpl.goal}</div>
                      </div>
                      <button
                        onClick={() => handleCreateFromTemplate({ userTemplateId: tpl.id })}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded"
                      >
                        Use
                      </button>
                    </div>
                    {tpl.exercises?.length > 0 && (
                      <ul className="mt-2 text-sm text-slate-700 list-disc list-inside">
                        {tpl.exercises.slice(0,4).map((ex) => (
                          <li key={ex.id}>{ex.name}{ex.sets?` • ${ex.sets}x${ex.reps??""}`:""}</li>
                        ))}
                        {tpl.exercises.length > 4 && <li>…</li>}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preset Builder (minimal) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
          <div className="font-semibold text-slate-800 mb-3">Create your preset</div>
          <PresetBuilder onCreated={async ()=>{ await loadUserTemplates(); }} />
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-slate-500">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="text-slate-500">No plans yet. Create one from a template above.</div>
          ) : (
            plans.map((plan) => {
              const completed = plan.exercises.filter((e) => e.completed);
              const active = plan.exercises.filter((e) => !e.completed);
              const showCompleted = expandedCompleted[plan.id];
              return (
              <div key={plan.id} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-blue-700">{plan.name}</div>
                    <div className="text-slate-500 text-sm">
                      {plan.equipment || ""}
                      {plan.goal ? ` • ${plan.goal}` : ""}
                    </div>
                  </div>
                  {/* One global 60s rest timer per plan */}
                  <RestTimer seconds={60} />
                </div>

                <div className="mt-3">
                  {plan.exercises.length === 0 ? (
                    <div className="text-slate-500">No exercises</div>
                  ) : (
                    <>
                      {/* Active (not completed) */}
                      <ul className="divide-y divide-slate-200">
                        {active.map((ex) => (
                          <li key={ex.id} className="py-3 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-slate-800">
                                {ex.name} {ex.sets ? `• ${ex.sets} sets` : ""} {ex.reps ? `• ${ex.reps} reps` : ""}
                              </div>
                              {ex.description && (
                                <div className="text-slate-500 text-sm">{ex.description}</div>
                              )}
                            </div>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!!ex.completed}
                                onChange={() => toggleExercise(ex)}
                              />
                              <span className="text-slate-700 text-sm">Done</span>
                            </label>
                          </li>
                        ))}
                      </ul>

                      {/* Add custom exercise */}
                      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="font-semibold text-slate-700 mb-2">Add exercise</div>
                        <div className="flex flex-col md:flex-row md:items-end gap-2">
                          <div className="flex-1 min-w-0">
                            <label className="block text-xs text-slate-500">Name</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded border border-slate-300"
                              value={(newExercise[plan.id]?.name) || ""}
                              onChange={(e) => setNewExercise((s) => ({ ...s, [plan.id]: { ...(s[plan.id]||{}), name: e.target.value } }))}
                              placeholder="e.g., Bench Press"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500">Sets</label>
                            <select
                              className="px-3 py-2 rounded border border-slate-300"
                              value={(newExercise[plan.id]?.sets) || ""}
                              onChange={(e) => setNewExercise((s) => ({ ...s, [plan.id]: { ...(s[plan.id]||{}), sets: e.target.value } }))}
                            >
                              <option value="">-</option>
                              {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500">Reps</label>
                            <select
                              className="px-3 py-2 rounded border border-slate-300"
                              value={(newExercise[plan.id]?.reps) || ""}
                              onChange={(e) => setNewExercise((s) => ({ ...s, [plan.id]: { ...(s[plan.id]||{}), reps: e.target.value } }))}
                            >
                              <option value="">-</option>
                              {[5,6,8,10,12,15,20].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <button
                            onClick={() => onAddExercise(plan.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Completed (collapsible) */}
                      {completed.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => toggleCompletedSection(plan.id)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {showCompleted ? "Hide" : "Show"} completed ({completed.length})
                          </button>
                          {showCompleted && (
                            <ul className="divide-y divide-slate-200 mt-2">
                              {completed.map((ex) => (
                                <li key={ex.id} className="py-2 flex items-center justify-between opacity-70">
                                  <div>
                                    <div className="font-medium text-slate-700 line-through">
                                      {ex.name} {ex.sets ? `• ${ex.sets} sets` : ""} {ex.reps ? `• ${ex.reps} reps` : ""}
                                    </div>
                                    {ex.logs?.length > 0 && (
                                      <div className="text-xs text-slate-500">
                                        Last done: {new Date(ex.logs[0].completedAt).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                  <label className="inline-flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={!!ex.completed}
                                      onChange={() => toggleExercise(ex)}
                                    />
                                    <span className="text-slate-700 text-sm">Done</span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
}

function PresetBuilder({ onCreated }) {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState("GYM");
  const [goal, setGoal] = useState("FITNESS");
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ name: "", sets: "", reps: "" });

  const addItem = () => {
    if (!draft.name.trim()) return;
    setItems((arr) => [...arr, { name: draft.name.trim(), sets: draft.sets?Number(draft.sets):undefined, reps: draft.reps?Number(draft.reps):undefined }]);
    setDraft({ name: "", sets: "", reps: "" });
  };

  const create = async () => {
    if (!name.trim()) return;
    const payload = { name: name.trim(), equipment, goal, exercises: items };
    await createUserTemplate(payload);
    setName(""); setItems([]); setDraft({ name: "", sets: "", reps: "" });
    onCreated && onCreated();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="block text-xs text-slate-500">Preset name</label>
          <input className="w-full px-3 py-2 rounded border border-slate-300" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., My Upper A" />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Equipment</label>
          <select className="px-3 py-2 rounded border border-slate-300" value={equipment} onChange={(e)=>setEquipment(e.target.value)}>
            {EQUIPMENT.map((o)=>(<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500">Goal</label>
          <select className="px-3 py-2 rounded border border-slate-300" value={goal} onChange={(e)=>setGoal(e.target.value)}>
            {GOALS.map((o)=>(<option key={o.value} value={o.value} disabled={o.value==='V_TAPER' && equipment!=='GYM'}>{o.label}</option>))}
          </select>
        </div>
        <button onClick={create} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded">Save preset</button>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="font-medium text-slate-700 mb-2">Exercises</div>
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-slate-500">Name</label>
            <input className="w-full px-3 py-2 rounded border border-slate-300" value={draft.name} onChange={(e)=>setDraft((d)=>({ ...d, name: e.target.value }))} placeholder="e.g., Bench Press" />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Sets</label>
            <select className="px-3 py-2 rounded border border-slate-300" value={draft.sets} onChange={(e)=>setDraft((d)=>({ ...d, sets: e.target.value }))}>
              <option value="">-</option>
              {[1,2,3,4,5,6].map((n)=>(<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Reps</label>
            <select className="px-3 py-2 rounded border border-slate-300" value={draft.reps} onChange={(e)=>setDraft((d)=>({ ...d, reps: e.target.value }))}>
              <option value="">-</option>
              {[5,6,8,10,12,15,20].map((n)=>(<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <button onClick={addItem} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">Add</button>
        </div>
        {items.length>0 && (
          <ul className="mt-3 text-sm text-slate-700 list-disc list-inside">
            {items.map((ex, idx)=>(<li key={idx}>{ex.name}{ex.sets?` • ${ex.sets}x${ex.reps??""}`:""}</li>))}
          </ul>
        )}
      </div>
    </div>
  );
}

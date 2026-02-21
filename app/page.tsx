"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
};

export default function Home() {
  const [taskInput, setTaskInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const [editDueDateInput, setEditDueDateInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tasks-v3");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks-v3", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      dueDate: dueDateInput,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskInput("");
    setDueDateInput("");
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditInput(task.text);
    setEditDueDateInput(task.dueDate);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditInput("");
    setEditDueDateInput("");
  }

  function saveEdit(id: number) {
    const trimmed = editInput.trim();
    if (!trimmed) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, text: trimmed, dueDate: editDueDateInput }
          : task
      )
    );
    cancelEditing();
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">My Mini To-Do App</h1>

        <div className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Enter a task..."
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <input
            type="date"
            value={dueDateInput}
            onChange={(e) => setDueDateInput(e.target.value)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
          />
          <button
            onClick={addTask}
            className="rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300 transition"
          >
            Add
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-300">
          <p>
            Total: {tasks.length} | Completed: {completedCount}
          </p>
          <button
            onClick={clearCompleted}
            className="rounded-lg bg-amber-500 px-3 py-1 font-medium text-slate-900 hover:bg-amber-400 transition"
          >
            Clear completed
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 h-4 w-4 accent-cyan-400"
                  />

                  {editingId === task.id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-cyan-400"
                      />
                      <input
                        type="date"
                        value={editDueDateInput}
                        onChange={(e) => setEditDueDateInput(e.target.value)}
                        className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:border-cyan-400"
                      />
                    </div>
                  ) : (
                    <div>
                      <p
                        className={
                          task.completed
                            ? "line-through text-slate-500"
                            : "text-white"
                        }
                      >
                        {task.text}
                      </p>
                      <p className="text-sm text-slate-400">
                        Due: {task.dueDate || "No due date"}
                      </p>
                    </div>
                  )}
                </label>

                <div className="flex gap-2">
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="rounded-lg bg-emerald-500 px-3 py-1 text-sm font-medium hover:bg-emerald-400 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="rounded-lg bg-slate-700 px-3 py-1 text-sm font-medium hover:bg-slate-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(task)}
                      className="rounded-lg bg-indigo-500 px-3 py-1 text-sm font-medium hover:bg-indigo-400 transition"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded-lg bg-rose-500 px-3 py-1 text-sm font-medium hover:bg-rose-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-slate-400">No tasks yet. Add your first one.</p>
        )}
      </div>
    </main>
  );
}

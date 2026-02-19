"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tasks-v2");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks-v2", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskInput("");
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

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold">My Mini To-Do App</h1>

        <div className="flex gap-2">
          <input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Enter a task..."
            className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-cyan-400"
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
              className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 accent-cyan-400"
                />
                <span
                  className={
                    task.completed ? "line-through text-slate-500" : "text-white"
                  }
                >
                  {task.text}
                </span>
              </label>

              <button
                onClick={() => deleteTask(task.id)}
                className="rounded-lg bg-rose-500 px-3 py-1 text-sm font-medium hover:bg-rose-400 transition"
              >
                Delete
              </button>
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

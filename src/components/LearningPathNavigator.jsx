import React, { useState, useEffect } from "react";

/**
 * Guided Learning Path Navigator UI Component.
 * Enables students to step through structured quantum curricula,
 * complete interactive checkpoints, and monitor curriculum mastery.
 */
export function LearningPathNavigator() {
  const [paths, setPaths] = useState([]);
  const [activePathId, setActivePathId] = useState("path_01");

  useEffect(() => {
    async function fetchPaths() {
      try {
        const response = await fetch("/learning/paths");
        const data = await response.json();
        if (data.paths) setPaths(data.paths);
      } catch (err) {
        console.error("Failed to load learning paths:", err);
      }
    }
    fetchPaths();
  }, []);

  const handleComplete = async (pathId, moduleId) => {
    try {
      await fetch("/learning/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathId, moduleId }),
      });
      // Refresh local paths
      setPaths((prev) =>
        prev.map((p) => {
          if (p.id !== pathId) return p;
          const updatedMods = p.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: true } : m
          );
          const completedCount = updatedMods.filter((m) => m.completed).length;
          return {
            ...p,
            modules: updatedMods,
            progressPercentage: Math.round((completedCount / updatedMods.length) * 100),
          };
        })
      );
    } catch (err) {
      console.error("Failed to update module completion:", err);
    }
  };

  const currentPath = paths.find((p) => p.id === activePathId) || paths[0];

  return (
    <div className="learning-path-navigator-panel p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-3">Guided Learning Path</h2>
      <div className="path-selector flex gap-2 mb-3">
        {paths.map((p) => (
          <button
            key={p.id}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              activePathId === p.id
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActivePathId(p.id)}
          >
            {p.title.split(":")[0]} ({p.progressPercentage}%)
          </button>
        ))}
      </div>

      {currentPath && (
        <div className="curriculum-card p-3 bg-amber-50 border border-amber-200 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-amber-900">{currentPath.title}</h3>
            <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-medium">
              {currentPath.difficulty} • {currentPath.estimatedMinutes} mins
            </span>
          </div>

          <div className="modules-list space-y-2 mt-3">
            {currentPath.modules.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between p-2 bg-white rounded border text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={mod.completed ? "text-green-600 font-bold" : "text-gray-400"}>
                    {mod.completed ? "✓" : "○"}
                  </span>
                  <span className={mod.completed ? "line-through text-gray-500" : "font-medium"}>
                    {mod.title}
                  </span>
                </div>
                {!mod.completed && (
                  <button
                    className="px-2 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
                    onClick={() => handleComplete(currentPath.id, mod.id)}
                  >
                    Mark Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPathNavigator;

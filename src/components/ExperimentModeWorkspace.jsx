import React, { useState } from "react";

/**
 * Experiment Mode Workspace UI Component.
 * Enables running classical Monte Carlo simulations of quantum experiments,
 * analyzing measurement histograms and state collapse.
 */
export function ExperimentModeWorkspace() {
  const [experimentType, setExperimentType] = useState("bell_state");
  const [shots, setShots] = useState(1024);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const runExperiment = async () => {
    setRunning(true);
    try {
      const response = await fetch("/experiment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentType, shots: Number(shots) }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Experiment execution failed:", err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="experiment-mode-workspace-panel p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-3">Experiment Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-700">Select Experiment:</label>
          <select
            className="w-full p-2 border rounded text-sm mt-1"
            value={experimentType}
            onChange={(e) => setExperimentType(e.target.value)}
          >
            <option value="bell_state">Bell State Entanglement Experiment</option>
            <option value="superposition_test">Single Qubit Superposition Experiment</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">Measurement Shots:</label>
          <input
            type="number"
            className="w-full p-2 border rounded text-sm mt-1"
            value={shots}
            onChange={(e) => setShots(e.target.value)}
            min="100"
            max="10000"
          />
        </div>
      </div>

      <button
        className="px-4 py-2 bg-violet-600 text-white rounded font-medium hover:bg-violet-700"
        onClick={runExperiment}
        disabled={running}
      >
        {running ? "Sampling Quantum Shots..." : "Run Experiment"}
      </button>

      {result && (
        <div className="experiment-output mt-4 p-3 bg-violet-50 border border-violet-200 rounded">
          <h3 className="font-bold text-sm text-violet-900">{result.title}</h3>
          <p className="text-xs text-violet-700 mb-2">Total Shots: {result.shots}</p>
          <div className="histogram-grid space-y-2">
            {Object.entries(result.empiricalCounts || {}).map(([state, count]) => {
              const pct = ((count / result.shots) * 100).toFixed(1);
              return (
                <div key={state}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono">{state}</span>
                    <span>
                      {count} shots ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-violet-200 h-2 rounded overflow-hidden">
                    <div className="bg-violet-700 h-2" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExperimentModeWorkspace;

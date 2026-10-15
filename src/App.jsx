import React, { useState } from "react";
import { QuantumCircuitBuilder } from "./components/QuantumCircuitBuilder.jsx";
import { BlochSphereVisualizer } from "./components/BlochSphereVisualizer.jsx";
import { AiTutorInterface } from "./components/AiTutorInterface.jsx";
import { ExperimentModeWorkspace } from "./components/ExperimentModeWorkspace.jsx";
import { LearningPathNavigator } from "./components/LearningPathNavigator.jsx";

/**
 * Main Application Component for the Quantum Computing Learning Simulator.
 * Unites interactive circuits, Bloch sphere visualization, AI tutoring,
 * experiment workspace, and guided curriculum.
 */
export function App() {
  const [activeTab, setActiveTab] = useState("circuit");
  const [lastState, setLastState] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="mb-6 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400">
          Quantum Computing Learning Simulator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore superposition, entanglement, and quantum gates with interactive circuits, real-time Bloch sphere visualization, and AI tutoring.
        </p>
      </header>

      <nav className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          className={`px-4 py-2 rounded text-sm font-semibold transition ${
            activeTab === "circuit" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("circuit")}
        >
          Circuit Builder & Bloch Sphere
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-semibold transition ${
            activeTab === "tutor" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("tutor")}
        >
          AI Tutor
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-semibold transition ${
            activeTab === "experiment" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("experiment")}
        >
          Experiment Mode
        </button>
        <button
          className={`px-4 py-2 rounded text-sm font-semibold transition ${
            activeTab === "curriculum" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => setActiveTab("curriculum")}
        >
          Guided Learning Paths
        </button>
      </nav>

      <main className="space-y-6">
        {activeTab === "circuit" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuantumCircuitBuilder onCircuitExecuted={(state) => setLastState(state)} />
            <BlochSphereVisualizer
              alpha={lastState?.stateVector?.[0] || { re: 1, im: 0 }}
              beta={lastState?.stateVector?.[1] || { re: 0, im: 0 }}
            />
          </div>
        )}

        {activeTab === "tutor" && <AiTutorInterface />}
        {activeTab === "experiment" && <ExperimentModeWorkspace />}
        {activeTab === "curriculum" && <LearningPathNavigator />}
      </main>
    </div>
  );
}

export default App;

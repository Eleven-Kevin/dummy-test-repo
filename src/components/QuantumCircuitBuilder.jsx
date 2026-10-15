import React, { useState } from "react";

/**
 * Interactive Quantum Circuit Builder UI Component.
 * Allows users to add quantum gates (Hadamard, Pauli-X, CNOT) to qubits
 * and observe the resulting quantum state vector and superposition.
 */
export function QuantumCircuitBuilder({ onCircuitExecuted }) {
  const [qubitCount, setQubitCount] = useState(2);
  const [gates, setGates] = useState([
    { type: "H", targetQubit: 0 },
    { type: "CNOT", controlQubit: 0, targetQubit: 1 },
  ]);
  const [circuitState, setCircuitState] = useState(null);
  const [loading, setLoading] = useState(false);

  const addGate = (type, targetQubit = 0, controlQubit = 0) => {
    setGates((prev) => [...prev, { type, targetQubit, controlQubit }]);
  };

  const clearCircuit = () => {
    setGates([]);
    setCircuitState(null);
  };

  const executeCircuit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/circuit/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qubitCount, gates }),
      });
      const data = await response.json();
      setCircuitState(data);
      if (onCircuitExecuted) onCircuitExecuted(data);
    } catch (err) {
      console.error("Execution error in QuantumCircuitBuilder:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quantum-circuit-builder-panel p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-3">Interactive Quantum Circuit Builder</h2>
      <div className="circuit-controls flex gap-2 mb-4">
        <button
          className="btn-gate px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => addGate("H", 0)}
        >
          Add Hadamard (H)
        </button>
        <button
          className="btn-gate px-3 py-1 bg-emerald-600 text-white rounded"
          onClick={() => addGate("X", 1)}
        >
          Add Pauli-X (NOT)
        </button>
        <button
          className="btn-gate px-3 py-1 bg-purple-600 text-white rounded"
          onClick={() => addGate("CNOT", 1, 0)}
        >
          Add CNOT
        </button>
        <button
          className="btn-clear px-3 py-1 bg-gray-500 text-white rounded"
          onClick={clearCircuit}
        >
          Clear
        </button>
      </div>

      <div className="circuit-canvas mb-4 bg-gray-900 text-white p-3 rounded font-mono">
        <svg width="100%" height="80" className="circuit-svg">
          <line x1="10" y1="25" x2="400" y2="25" stroke="#4ade80" strokeWidth="2" />
          <text x="15" y="20" fill="#fff" fontSize="12">q[0]: |0⟩</text>
          <line x1="10" y1="65" x2="400" y2="65" stroke="#4ade80" strokeWidth="2" />
          <text x="15" y="60" fill="#fff" fontSize="12">q[1]: |0⟩</text>
        </svg>
        <p className="text-xs text-gray-400 mt-1">
          Configured Gates: {gates.map((g) => `${g.type}(q${g.targetQubit})`).join(" -> ") || "None"}
        </p>
      </div>

      <button
        className="btn-run px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
        onClick={executeCircuit}
        disabled={loading}
      >
        {loading ? "Simulating Circuit..." : "Run Quantum Simulation"}
      </button>

      {circuitState && (
        <div className="results mt-4 p-3 bg-gray-50 border rounded">
          <h4 className="font-semibold text-sm">State Distribution</h4>
          <ul className="text-xs space-y-1 mt-1">
            {circuitState.probabilities.map((p) => (
              <li key={p.basisState}>
                {p.basisState}: {(p.probability * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuantumCircuitBuilder;

import React, { useState } from "react";

/**
 * AI Tutor Interface UI Component.
 * Provides interactive quantum concept explanations, guided responses,
 * and conceptual Q&A for students.
 */
export function AiTutorInterface() {
  const [topic, setTopic] = useState("superposition");
  const [question, setQuestion] = useState("How does superposition work?");
  const [explanationData, setExplanationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/tutor/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, question }),
      });
      const data = await response.json();
      setExplanationData(data);
    } catch (err) {
      console.error("Error communicating with AI Tutor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tutor-panel p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-3">AI Tutor for Concept Explanation</h2>
      <div className="flex flex-col gap-2 mb-3">
        <label className="text-xs font-semibold text-gray-700">Choose Concept Topic:</label>
        <select
          className="p-2 border rounded text-sm"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="superposition">Quantum Superposition</option>
          <option value="entanglement">Quantum Entanglement</option>
          <option value="hadamard">Hadamard Gate (H)</option>
          <option value="bloch_sphere">Bloch Sphere Representation</option>
        </select>

        <label className="text-xs font-semibold text-gray-700 mt-2">Ask Question:</label>
        <input
          type="text"
          className="p-2 border rounded text-sm"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about quantum concepts..."
        />
        <button
          className="btn-ask mt-2 px-4 py-2 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700"
          onClick={requestExplanation}
          disabled={loading}
        >
          {loading ? "Generating Concept Explanation..." : "Ask AI Tutor"}
        </button>
      </div>

      {explanationData && (
        <div className="ai-response p-3 bg-emerald-50 border border-emerald-200 rounded">
          <h3 className="font-bold text-sm text-emerald-900">{explanationData.topic}</h3>
          <p className="text-xs text-emerald-800 mt-1">{explanationData.explanation}</p>
          <div className="font-mono text-xs bg-white p-2 rounded mt-2 border text-emerald-950">
            Formula: {explanationData.formula}
          </div>
          <p className="text-xs italic text-emerald-700 mt-2">{explanationData.contextualNote}</p>
        </div>
      )}
    </div>
  );
}

export default AiTutorInterface;

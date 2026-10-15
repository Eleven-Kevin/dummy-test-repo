/**
 * Service for the AI Tutor concept explanation system.
 * Delivers contextual quantum concept explanations and interactive guidance.
 */
export class AiTutorConceptExplainerService {
  constructor() {
    this.knowledgeBase = {
      superposition: {
        concept: "Quantum Superposition",
        explanation:
          "A quantum qubit can exist in a linear combination of states |0⟩ and |1⟩ simultaneously until measured. Applying a Hadamard gate puts a qubit into equal superposition.",
        formula: "|ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1",
        difficulty: "Beginner",
      },
      entanglement: {
        concept: "Quantum Entanglement",
        explanation:
          "Two or more qubits become inextricably correlated such that the quantum state of each particle cannot be described independently of the others, regardless of spatial distance.",
        formula: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
        difficulty: "Intermediate",
      },
      hadamard: {
        concept: "Hadamard Gate (H)",
        explanation:
          "The Hadamard gate transforms the computational basis states |0⟩ and |1⟩ into orthogonal superposition states (|0⟩ + |1⟩)/√2 and (|0⟩ - |1⟩)/√2.",
        formula: "H = 1/√2 [[1, 1], [1, -1]]",
        difficulty: "Beginner",
      },
      bloch_sphere: {
        concept: "Bloch Sphere Representation",
        explanation:
          "A geometrical representation of the pure state space of a two-level quantum mechanical system (qubit) on the surface of a unit sphere.",
        formula: "|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩",
        difficulty: "Intermediate",
      },
    };
  }

  explainConcept(conceptKey = "superposition", userQuestion = "") {
    try {
      const normalizedKey = (conceptKey || "superposition").toLowerCase().replace(/[\s-]/g, "_");
      const matched = this.knowledgeBase[normalizedKey] || this.knowledgeBase.superposition;

      const contextualNote = userQuestion
        ? `Regarding your question "${userQuestion}": Focus on the phase relationship and transformation matrix.`
        : "Explore this concept by modifying the gate sequence on the interactive circuit builder.";

      return {
        success: true,
        topic: matched.concept,
        explanation: matched.explanation,
        formula: matched.formula,
        difficulty: matched.difficulty,
        contextualNote,
        followUpQuestions: [
          "How does measurement cause wave-function collapse?",
          "What happens if you apply a second Hadamard gate in succession?",
        ],
      };
    } catch (err) {
      console.error("Error in AiTutorConceptExplainerService.explainConcept:", err);
      throw err;
    }
  }

  getAllConcepts() {
    return Object.values(this.knowledgeBase);
  }
}

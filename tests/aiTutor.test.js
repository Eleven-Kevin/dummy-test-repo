import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { AiTutorConceptExplainerService } from "../src/services/aiTutorConceptExplainerService.js";

describe("AI Tutor Concept Explanation Tests", () => {
  const aiTutor = new AiTutorConceptExplainerService();

  test("generates detailed concept explanation for superposition", () => {
    const result = aiTutor.explainConcept("superposition", "What does superposition mean?");
    assert.equal(result.success, true);
    assert.equal(result.topic, "Quantum Superposition");
    assert.ok(result.explanation.includes("linear combination"));
    assert.ok(result.formula.includes("α|0⟩ + β|1⟩"));
    assert.ok(Array.isArray(result.followUpQuestions));
  });

  test("generates concept explanation for quantum entanglement", () => {
    const result = aiTutor.explainConcept("entanglement");
    assert.equal(result.success, true);
    assert.equal(result.topic, "Quantum Entanglement");
    assert.ok(result.explanation.includes("correlated"));
    assert.ok(result.formula.includes("|Φ⁺⟩"));
  });
});

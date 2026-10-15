import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { QuantumCircuitBuilderService } from "../src/services/quantumCircuitBuilderService.js";

describe("Interactive Quantum Circuit Builder Tests", () => {
  const circuitBuilder = new QuantumCircuitBuilderService();

  test("initializes multi-qubit system into ground state |00⟩", () => {
    const result = circuitBuilder.buildCircuit(2, []);
    assert.equal(result.success, true);
    assert.equal(result.qubitCount, 2);
    assert.equal(result.isSuperposition, false);
    assert.equal(result.isEntangled, false);
    assert.equal(result.probabilities[0].basisState, "|00⟩");
    assert.equal(result.probabilities[0].probability, 1.0);
  });

  test("applying Hadamard gate creates equal quantum superposition", () => {
    const gates = [{ type: "H", targetQubit: 0 }];
    const result = circuitBuilder.buildCircuit(1, gates);
    assert.equal(result.success, true);
    assert.equal(result.isSuperposition, true);

    const probZero = result.probabilities.find((p) => p.basisState === "|0⟩")?.probability;
    const probOne = result.probabilities.find((p) => p.basisState === "|1⟩")?.probability;
    assert.ok(Math.abs(probZero - 0.5) < 0.01);
    assert.ok(Math.abs(probOne - 0.5) < 0.01);
  });

  test("applying Hadamard and CNOT gates creates entangled Bell state |Φ⁺⟩", () => {
    const gates = [
      { type: "H", targetQubit: 0 },
      { type: "CNOT", controlQubit: 0, targetQubit: 1 },
    ];
    const result = circuitBuilder.buildCircuit(2, gates);
    assert.equal(result.success, true);
    assert.equal(result.isEntangled, true);

    const p00 = result.probabilities.find((p) => p.basisState === "|00⟩")?.probability;
    const p11 = result.probabilities.find((p) => p.basisState === "|11⟩")?.probability;
    const p01 = result.probabilities.find((p) => p.basisState === "|01⟩")?.probability;
    const p10 = result.probabilities.find((p) => p.basisState === "|10⟩")?.probability;

    assert.ok(p00 > 0.45);
    assert.ok(p11 > 0.45);
    assert.equal(p01, 0);
    assert.equal(p10, 0);
  });
});

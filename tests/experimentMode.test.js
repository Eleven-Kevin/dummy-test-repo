import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { ExperimentModeRunnerService } from "../src/services/experimentModeRunnerService.js";

describe("Experiment Mode Runner Tests", () => {
  const runner = new ExperimentModeRunnerService();

  test("runs Bell state experiment and accumulates expected measurement shots", () => {
    const shots = 1000;
    const result = runner.runExperiment("bell_state", shots);

    assert.equal(result.success, true);
    assert.equal(result.shots, shots);
    assert.equal(result.isEntangled, true);

    const counts = result.empiricalCounts;
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    assert.equal(totalCount, shots);

    // In Bell state (|00> + |11>)/sqrt(2), counts should be almost entirely in |00> and |11>
    const p00Count = counts["|00⟩"] || 0;
    const p11Count = counts["|11⟩"] || 0;
    assert.ok(p00Count + p11Count > 950);
  });

  test("lists all pre-configured quantum experiments in workspace", () => {
    const list = runner.listExperiments();
    assert.ok(Array.isArray(list));
    assert.ok(list.length >= 2);
    assert.ok(list.some((exp) => exp.id === "bell_state"));
  });
});

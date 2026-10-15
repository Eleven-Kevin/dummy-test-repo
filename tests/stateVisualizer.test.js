import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BlochSphereStateVisualizerService } from "../src/services/blochSphereStateVisualizerService.js";

describe("Real-Time State Visualization (Bloch Sphere) Tests", () => {
  const visualizer = new BlochSphereStateVisualizerService();

  test("calculates ground state |0⟩ pointing to North Pole on Bloch sphere", () => {
    const alpha = { re: 1, im: 0 };
    const beta = { re: 0, im: 0 };
    const result = visualizer.visualizeBlochSphere(alpha, beta);

    assert.equal(result.success, true);
    assert.equal(result.coordinates.x, 0);
    assert.equal(result.coordinates.y, 0);
    assert.equal(result.coordinates.z, 1);
    assert.equal(result.sphericalAngles.theta, 0);

    const probZero = result.probabilityDistribution.find((d) => d.state === "|0⟩")?.probability;
    const probOne = result.probabilityDistribution.find((d) => d.state === "|1⟩")?.probability;
    assert.equal(probZero, 1.0);
    assert.equal(probOne, 0.0);
  });

  test("calculates superposition state (|0⟩ + |1⟩)/√2 pointing along positive X axis", () => {
    const invSqrt2 = 1 / Math.SQRT2;
    const alpha = { re: invSqrt2, im: 0 };
    const beta = { re: invSqrt2, im: 0 };
    const result = visualizer.visualizeBlochSphere(alpha, beta);

    assert.equal(result.success, true);
    assert.ok(Math.abs(result.coordinates.x - 1) < 0.01);
    assert.ok(Math.abs(result.coordinates.y) < 0.01);
    assert.ok(Math.abs(result.coordinates.z) < 0.01);

    // Theta is pi/2 (90 degrees equator)
    assert.ok(Math.abs(result.sphericalAngles.thetaDegrees - 90) < 0.1);
  });
});

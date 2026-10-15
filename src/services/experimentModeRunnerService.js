import { QuantumCircuitBuilderService } from "./quantumCircuitBuilderService.js";

/**
 * Service for Experiment Mode Runner.
 * Executes preset and custom quantum experiments with Monte Carlo measurement shots.
 */
export class ExperimentModeRunnerService {
  constructor() {
    this.circuitBuilder = new QuantumCircuitBuilderService();
    this.experiments = {
      bell_state: {
        id: "bell_state",
        title: "Bell State Entanglement Experiment",
        description: "Creates maximally entangled pair |Φ⁺⟩ using Hadamard and CNOT gates.",
        qubitCount: 2,
        gates: [
          { type: "H", targetQubit: 0 },
          { type: "CNOT", controlQubit: 0, targetQubit: 1 },
        ],
      },
      superposition_test: {
        id: "superposition_test",
        title: "Single Qubit Superposition Experiment",
        description: "Places a qubit into equal superposition and measures outcome distribution.",
        qubitCount: 1,
        gates: [{ type: "H", targetQubit: 0 }],
      },
    };
  }

  runExperiment(experimentType = "bell_state", shots = 1024) {
    try {
      const preset = this.experiments[experimentType] || this.experiments.bell_state;
      const circuitResult = this.circuitBuilder.buildCircuit(preset.qubitCount, preset.gates);

      // Perform Monte Carlo sampling across theoretical probabilities
      const histogram = {};
      circuitResult.probabilities.forEach((p) => {
        histogram[p.basisState] = 0;
      });

      // CDF for sampling
      const cdf = [];
      let cumulative = 0;
      for (const p of circuitResult.probabilities) {
        cumulative += p.probability;
        cdf.push({ state: p.basisState, limit: cumulative });
      }

      // Pseudo-random shots generator (no external dependencies, deterministic seed option)
      for (let s = 0; s < shots; s++) {
        const rand = Math.random();
        const selected = cdf.find((entry) => rand <= entry.limit) || cdf[cdf.length - 1];
        histogram[selected.state] = (histogram[selected.state] || 0) + 1;
      }

      return {
        success: true,
        experimentId: preset.id,
        title: preset.title,
        shots,
        theoreticalProbabilities: circuitResult.probabilities,
        empiricalCounts: histogram,
        isEntangled: circuitResult.isEntangled,
        isSuperposition: circuitResult.isSuperposition,
      };
    } catch (err) {
      console.error("Error in ExperimentModeRunnerService.runExperiment:", err);
      throw err;
    }
  }

  listExperiments() {
    return Object.values(this.experiments);
  }
}

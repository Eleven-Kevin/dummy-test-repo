import { QuantumStateModel } from "../models/quantumStateModel.js";

/**
 * Service for the Interactive Quantum Circuit Builder.
 * Simulates quantum gate transformations on multi-qubit systems.
 */
export class QuantumCircuitBuilderService {
  constructor() {
    this.model = new QuantumStateModel();
  }

  buildCircuit(qubitCount = 2, gates = []) {
    try {
      const dimension = 2 ** qubitCount;
      // Initialize system to |00...0>
      let stateVector = Array.from({ length: dimension }, (_, i) =>
        i === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 }
      );

      // Apply each quantum gate sequentially
      for (const gate of gates) {
        stateVector = this.applyGate(stateVector, gate, qubitCount);
      }

      this.model.updateState(stateVector);
      const probabilities = this.model.calculateProbabilities();

      // Check for quantum superposition and entanglement
      const isSuperposition = probabilities.filter((p) => p.probability > 0.05).length > 1;
      const isEntangled =
        qubitCount >= 2 &&
        probabilities.some((p) => p.basisState === "|00⟩" && p.probability > 0.4) &&
        probabilities.some((p) => p.basisState === "|11⟩" && p.probability > 0.4);

      return {
        success: true,
        qubitCount,
        gatesApplied: gates.length,
        stateVector,
        probabilities,
        isSuperposition,
        isEntangled,
      };
    } catch (err) {
      console.error("Error in QuantumCircuitBuilderService.buildCircuit:", err);
      throw err;
    }
  }

  applyGate(stateVector, gate, qubitCount) {
    const { type, targetQubit, controlQubit } = gate;
    const nextVector = stateVector.map((amp) => ({ ...amp }));

    if (type === "H") {
      // Hadamard Gate on targetQubit creates equal superposition
      const invSqrt2 = 1 / Math.SQRT2;
      for (let i = 0; i < stateVector.length; i++) {
        const bit = (i >> (qubitCount - 1 - targetQubit)) & 1;
        if (bit === 0) {
          const partnerIndex = i | (1 << (qubitCount - 1 - targetQubit));
          const amp0 = stateVector[i];
          const amp1 = stateVector[partnerIndex];
          nextVector[i] = {
            re: (amp0.re + amp1.re) * invSqrt2,
            im: (amp0.im + amp1.im) * invSqrt2,
          };
          nextVector[partnerIndex] = {
            re: (amp0.re - amp1.re) * invSqrt2,
            im: (amp0.im - amp1.im) * invSqrt2,
          };
        }
      }
    } else if (type === "X") {
      // Pauli-X (NOT) Gate flips targetQubit
      for (let i = 0; i < stateVector.length; i++) {
        const bit = (i >> (qubitCount - 1 - targetQubit)) & 1;
        if (bit === 0) {
          const partnerIndex = i | (1 << (qubitCount - 1 - targetQubit));
          nextVector[i] = stateVector[partnerIndex];
          nextVector[partnerIndex] = stateVector[i];
        }
      }
    } else if (type === "CNOT") {
      // Controlled-NOT Gate
      for (let i = 0; i < stateVector.length; i++) {
        const controlBit = (i >> (qubitCount - 1 - controlQubit)) & 1;
        const targetBit = (i >> (qubitCount - 1 - targetQubit)) & 1;
        if (controlBit === 1 && targetBit === 0) {
          const partnerIndex = i | (1 << (qubitCount - 1 - targetQubit));
          nextVector[i] = stateVector[partnerIndex];
          nextVector[partnerIndex] = stateVector[i];
        }
      }
    }

    return nextVector;
  }
}

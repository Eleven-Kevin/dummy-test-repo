/**
 * Quantum State Data Model & Schema definitions.
 */

export class QuantumStateModel {
  constructor(initialAmplitudes = [{ re: 1, im: 0 }, { re: 0, im: 0 }]) {
    this.state = {
      amplitudes: initialAmplitudes,
      qubitCount: Math.log2(initialAmplitudes.length) || 1,
      timestamp: new Date().toISOString(),
    };
  }

  getAmplitudes() {
    return this.state.amplitudes;
  }

  updateState(newAmplitudes) {
    if (!Array.isArray(newAmplitudes)) {
      throw new Error("Invalid state update: amplitudes must be an array.");
    }
    this.state.amplitudes = newAmplitudes;
    this.state.qubitCount = Math.log2(newAmplitudes.length) || 1;
    this.state.timestamp = new Date().toISOString();
    return this.state;
  }

  calculateProbabilities() {
    return this.state.amplitudes.map((amp, idx) => {
      const prob = amp.re * amp.re + amp.im * amp.im;
      const bin = idx.toString(2).padStart(this.state.qubitCount, "0");
      return {
        basisState: `|${bin}⟩`,
        probability: Number(prob.toFixed(4)),
      };
    });
  }
}

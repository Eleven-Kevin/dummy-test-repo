/**
 * Service for Real-Time State Visualization on the Bloch Sphere
 * and probability distributions of quantum states.
 */
export class BlochSphereStateVisualizerService {
  visualizeBlochSphere(alpha = { re: 1, im: 0 }, beta = { re: 0, im: 0 }) {
    try {
      // Normalization check: |alpha|^2 + |beta|^2 = 1
      const normSquared = alpha.re ** 2 + alpha.im ** 2 + beta.re ** 2 + beta.im ** 2;
      const norm = Math.sqrt(normSquared) || 1;

      const a_re = alpha.re / norm;
      const a_im = alpha.im / norm;
      const b_re = beta.re / norm;
      const b_im = beta.im / norm;

      // Bloch sphere Cartesian coordinates (x, y, z):
      // x = 2 * Re(alpha* * beta)
      // y = 2 * Im(alpha* * beta)
      // z = |alpha|^2 - |beta|^2
      const x = 2 * (a_re * b_re + a_im * b_im);
      const y = 2 * (a_re * b_im - a_im * b_re);
      const z = a_re ** 2 + a_im ** 2 - (b_re ** 2 + b_im ** 2);

      // Spherical coordinates: polar angle theta, azimuthal angle phi
      const theta = Math.acos(Math.max(-1, Math.min(1, z)));
      const phi = Math.atan2(y, x);

      // Real-time state probability distribution
      const probZero = a_re ** 2 + a_im ** 2;
      const probOne = b_re ** 2 + b_im ** 2;

      return {
        success: true,
        coordinates: {
          x: Number(x.toFixed(4)),
          y: Number(y.toFixed(4)),
          z: Number(z.toFixed(4)),
        },
        sphericalAngles: {
          theta: Number(theta.toFixed(4)),
          phi: Number(phi.toFixed(4)),
          thetaDegrees: Number(((theta * 180) / Math.PI).toFixed(2)),
          phiDegrees: Number(((phi * 180) / Math.PI).toFixed(2)),
        },
        probabilityDistribution: [
          { state: "|0⟩", probability: Number(probZero.toFixed(4)) },
          { state: "|1⟩", probability: Number(probOne.toFixed(4)) },
        ],
      };
    } catch (err) {
      console.error("Error in BlochSphereStateVisualizerService.visualizeBlochSphere:", err);
      throw err;
    }
  }
}

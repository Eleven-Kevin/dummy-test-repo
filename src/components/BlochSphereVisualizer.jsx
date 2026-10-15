import React, { useState, useEffect } from "react";

/**
 * Bloch Sphere State Visualizer UI Component.
 * Visualizes the 3D projection of a single qubit statevector on the Bloch Sphere
 * and displays real-time state probability distributions.
 */
export function BlochSphereVisualizer({ alpha = { re: 1, im: 0 }, beta = { re: 0, im: 0 } }) {
  const [blochData, setBlochData] = useState(null);

  useEffect(() => {
    async function fetchBlochData() {
      try {
        const response = await fetch("/state/bloch-sphere", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alpha, beta }),
        });
        const data = await response.json();
        setBlochData(data);
      } catch (err) {
        console.error("Error fetching Bloch sphere visualization:", err);
      }
    }
    fetchBlochData();
  }, [alpha, beta]);

  return (
    <div className="bloch-sphere-visualizer-panel p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-3">Real-Time State Visualization (Bloch Sphere)</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="bloch-sphere-graphic bg-gray-900 p-4 rounded text-center">
          <svg width="180" height="180" viewBox="0 0 200 200" className="bloch-svg">
            <circle cx="100" cy="100" r="80" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.4" />
            <ellipse cx="100" cy="100" rx="80" ry="25" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="3 3" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="105" y="25" fill="#38bdf8" fontSize="12">|0⟩</text>
            <text x="105" y="195" fill="#38bdf8" fontSize="12">|1⟩</text>
            {blochData && (
              <circle
                cx={100 + blochData.coordinates.x * 60}
                cy={100 - blochData.coordinates.z * 60}
                r="6"
                fill="#f43f5e"
              />
            )}
          </svg>
          <p className="text-xs text-gray-400 mt-2">Bloch Unit Sphere (x, y, z)</p>
        </div>

        <div className="probabilities-panel flex-1">
          <h3 className="font-semibold text-sm mb-2">State Probability Distributions</h3>
          {blochData?.probabilityDistribution ? (
            <div className="space-y-3">
              {blochData.probabilityDistribution.map((dist) => (
                <div key={dist.state}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{dist.state}</span>
                    <span>{(dist.probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2"
                      style={{ width: `${dist.probability * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-2">
                Spherical angles: θ = {blochData.sphericalAngles.thetaDegrees}°, φ = {blochData.sphericalAngles.phiDegrees}°
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">Computing statevector distribution...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlochSphereVisualizer;

"""Plot the depth-dose curve written by run.mac and print the Bragg-peak position.

Usage: python3 plot.py depth_dose.csv
"""
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

BIN_WIDTH_CM = 0.1  # 40 cm / 400 bins, see run.mac

csv_path = sys.argv[1] if len(sys.argv) > 1 else "depth_dose.csv"
data = np.loadtxt(csv_path, delimiter=",", comments="#")
iz, edep = data[:, 2], data[:, 3]
depth = (iz + 0.5) * BIN_WIDTH_CM

peak = np.argmax(edep)
# R80: depth behind the peak where the dose falls to 80% of its maximum.
# For protons it is the best estimate of the beam range.
distal = np.nonzero(edep[peak:] < 0.8 * edep[peak])[0]
r80 = depth[peak + distal[0]] if distal.size else float("nan")

print(f"Bragg peak at {depth[peak]:.1f} cm")
print(f"Range (R80)   {r80:.1f} cm")

plt.plot(depth, edep / edep[peak])
plt.axvline(r80, linestyle="--", color="gray", label=f"R80 = {r80:.1f} cm")
plt.xlabel("Depth in water [cm]")
plt.ylabel("Energy deposit (relative)")
plt.legend()
plt.savefig("depth_dose.png", dpi=150)
print("Saved depth_dose.png")

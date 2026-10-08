"""Print the Bragg-peak position and range from the depth-dose curve written by run.mac.

Needs only plain Python 3. If matplotlib is installed, it also saves depth_dose.png.

Usage: python3 plot.py depth_dose.csv
"""
import sys

BIN_WIDTH_CM = 0.1  # 40 cm / 400 bins, see run.mac

csv_path = sys.argv[1] if len(sys.argv) > 1 else "depth_dose.csv"
depth, edep = [], []
with open(csv_path) as f:
    for line in f:
        if line.startswith("#") or not line.strip():
            continue
        cols = line.split(",")
        depth.append((int(cols[2]) + 0.5) * BIN_WIDTH_CM)
        edep.append(float(cols[3]))

peak = max(range(len(edep)), key=edep.__getitem__)
# R80: depth behind the peak where the dose falls to 80% of its maximum.
# For protons it is the best estimate of the beam range.
r80 = next((depth[i] for i in range(peak, len(edep)) if edep[i] < 0.8 * edep[peak]), float("nan"))

print(f"Bragg peak at {depth[peak]:.1f} cm")
print(f"Range (R80)   {r80:.1f} cm")

try:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except ImportError:
    print("matplotlib not installed, skipping the plot")
    sys.exit(0)

plt.plot(depth, [e / edep[peak] for e in edep])
plt.axvline(r80, linestyle="--", color="gray", label=f"R80 = {r80:.1f} cm")
plt.xlabel("Depth in water [cm]")
plt.ylabel("Energy deposit (relative)")
plt.legend()
plt.savefig("depth_dose.png", dpi=150)
print("Saved depth_dose.png")

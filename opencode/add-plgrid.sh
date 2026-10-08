#!/usr/bin/env bash
# Connect opencode in one directory (e.g. the geant4-ai workspace) to the PLGrid Forge models.
#
# Usage: bash add-plgrid.sh <directory>
#
# - copies the provider plugin into <directory>/.opencode/plugins/
# - merges the settings from opencode.json next to this script (default model, ...) into
#   <directory>/opencode.json, keeping whatever is already there (e.g. the permissions that
#   geant4-ai's bootstrap.sh writes)
#
# Nothing outside <directory> is touched.
set -euo pipefail

dest="${1:?usage: bash add-plgrid.sh <directory>}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -d "$dest" ]; then
  echo "add-plgrid.sh: $dest is not a directory" >&2
  exit 1
fi

mkdir -p "$dest/.opencode/plugins"
cp "$here/plugins/plgrid.js" "$dest/.opencode/plugins/plgrid.js"
echo "copied  $dest/.opencode/plugins/plgrid.js"

python3 - "$dest/opencode.json" "$here/opencode.json" <<'EOF'
import json
import os
import sys

target, ours = sys.argv[1], sys.argv[2]
config = {"$schema": "https://opencode.ai/config.json"}
if os.path.exists(target):
    with open(target) as f:
        config = json.load(f)
with open(ours) as f:
    settings = json.load(f)
settings.pop("$schema", None)
config.update(settings)

# Write a new file and move it into place: if target is a symlink (bootstrap.sh --link),
# this replaces the link instead of editing the toolkit file it points to.
tmp = target + ".tmp"
with open(tmp, "w") as f:
    json.dump(config, f, indent=2)
    f.write("\n")
os.replace(tmp, target)
print("merged  {} into {}".format(", ".join(sorted(settings)), target))
EOF

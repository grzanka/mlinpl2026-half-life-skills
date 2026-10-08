# Set the tutorial's environment variables for this terminal only.
#
# Usage (in every new terminal, and after every srun on Ares):
#   source <TUTORIAL_DIR>/mlinpl2026-half-life-skills/tutorial-env.sh
#
# Nothing is written to ~/.bashrc or anywhere else: close the terminal and it's gone.
#
#   TUTORIAL_DIR   the directory holding both repositories (this one and geant4-ai)
#   G4_SOURCE_DIR  the Geant4 source, used by the geant4-ai toolkit
#   PATH           gets ~/.opencode/bin, if opencode is installed there

if [ -n "${BASH_SOURCE:-}" ]; then
  _tutorial_script="${BASH_SOURCE[0]}"
elif [ -n "${ZSH_VERSION:-}" ]; then
  _tutorial_script="${(%):-%x}"
else
  echo "tutorial-env.sh: needs bash or zsh" >&2
  return 1 2>/dev/null || exit 1
fi

TUTORIAL_DIR="$(cd "$(dirname "$_tutorial_script")/.." && pwd)"
G4_SOURCE_DIR="$TUTORIAL_DIR/geant4-ai/external/geant4"
export TUTORIAL_DIR G4_SOURCE_DIR
if [ -d "$HOME/.opencode/bin" ]; then
  case ":$PATH:" in
    *":$HOME/.opencode/bin:"*) ;;
    *) export PATH="$HOME/.opencode/bin:$PATH" ;;
  esac
fi
unset _tutorial_script

echo "TUTORIAL_DIR=$TUTORIAL_DIR"
echo "G4_SOURCE_DIR=$G4_SOURCE_DIR"
if [ ! -d "$G4_SOURCE_DIR/source" ]; then
  echo "warning: no Geant4 source in $G4_SOURCE_DIR (is geant4-ai cloned next to this repository?)" >&2
fi

#!/bin/bash

# Verzeichnis für Git-Hooks
HOOKS_DIR=".git/hooks"

# Sicherstellen, dass das Hook-Verzeichnis existiert
if [ ! -d "$HOOKS_DIR" ]; then
  echo "Error: This script must be run from the root of a Git repository."
  exit 1
fi

# Kopieren der Hook-Skripte in das Git-Hook-Verzeichnis
cp hooks/pre-commit $HOOKS_DIR/

# Ausführbar machen der Hook-Skripte
chmod +x $HOOKS_DIR/pre-commit

echo "Git hooks have been set up successfully."

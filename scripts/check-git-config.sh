#!/bin/bash

# check-git-config.sh

# Function to check case sensitivity
check_case_sensitivity() {
  local ignorecase=$(git config --get core.ignorecase)
  if [ "$ignorecase" != "false" ]; then
    echo "Error: Git is configured to be case insensitive. Run 'git config core.ignorecase false' to set Git to be case sensitive."
    return 1
  fi
}

# Function to check end-of-line (EOL) configuration
check_eol_config() {
  local eol=$(git config --get core.eol)
  if [ "$eol" != "lf" ]; then
    echo "Error: Git is not configured to use LF as the end-of-line character. Run 'git config core.eol lf' to enforce LF as EOL."
    return 1
  fi
}

# Check both configurations
check_case_sensitivity && check_eol_config

# Capture the exit status of the checks
status=$?

# Exit with the combined status of both checks
exit $status

#!/usr/bin/env bash

# Run setup
echo "Running setup..."
tsx ./tests/setup.ts
setup_code=$?

if [ $setup_code -ne 0 ]; then
  echo "Setup failed with code $setup_code"
  exit $setup_code
fi

# Run tests with realtime output
echo "Running tests..."
NODE_ENV=test vitest run $@
test_code=$?

# Run teardown
echo "Running teardown..."
rm -rf node_modules/.vite/vitest && tsx ./tests/teardown.ts
teardown_code=$?

# If teardown fails, log it but don't override test result
if [ $teardown_code -ne 0 ]; then
  echo "Warning: Teardown failed with code $teardown_code"
fi

# Exit with test result code
exit $test_code

#!/usr/bin/env node

const crossSpawn = require("cross-spawn");
const argument = process.argv.slice(2);

if (["start", "build", "analyzer"].includes(argument[0])) {
  const result = crossSpawn.sync(
    process.execPath,
    [require.resolve(`../script/${argument[0]}.js`)],
    {
      stdio: "inherit",
    }
  );
  if (result.signal) {
    if (result.signal === "SIGKILL") {
      console.log(
        "The build failed because the process exited too early. " +
          "This probably means the system ran out of memory or someone called " +
          "`kill -9` on the process."
      );
    } else if (result.signal === "SIGTERM") {
      console.log(
        "The build failed because the process exited too early. " +
          "Someone might have called `kill` or `killall`, or the system could " +
          "be shutting down."
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log('Unknown script "' + argument[0] + '".');
  console.log("Perhaps you need to update react-scripts?");
}

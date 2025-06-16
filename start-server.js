// Simple server startup script for deployment
const path = require("path");
const { spawn } = require("child_process");

console.log("Starting SkillSync server...");
console.log("Current directory:", process.cwd());

// Change to server directory and start the server
const serverProcess = spawn("node", ["index.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
});

serverProcess.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

serverProcess.on("exit", (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});

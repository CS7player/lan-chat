#!/usr/bin/env node

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pkg = require("./package.json");

const args = process.argv.slice(2);

if (args.includes("-h") || args.includes("--help")) {
  console.log(`
lan-chat - Terminal LAN Chat Application

Usage:
  lan-chat               Start the application
  lan-chat -h, --help    Show help information
  lan-chat -v, --version Show application version

Controls:
  Tab            Toggle between UI components
  Up/Down Arrow  Navigate users
  Enter          Select user / Send message

Focused components are highlighted with a purple border.
`);
  process.exit(0);
}

if (args.includes("-v") || args.includes("--version")) {
  console.log("lan-chat current verSion is ->",pkg.version);
  process.exit(0);
}

import("./src/start.js");
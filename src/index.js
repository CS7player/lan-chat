// src/index.js

import os from "os";

import { startDiscovery } from "./network/discovery.js";
import {
  startWSServer,
  connectToPeer,
  sendMessage,
} from "./network/websocket.js";

const username = os.userInfo().username;

startWSServer(username, (data) => {
  console.log("EVENT:", data);
});

startDiscovery(username, (user) => {
  // ignore self
  if (user.username === username) return;

  connectToPeer(user.ip, username, (msg) => {
    console.log(msg);
  });
});

// Example
setTimeout(() => {
  sendMessage(username, "Hello LAN!");
}, 5000);
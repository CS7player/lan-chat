import os from "os";

import { startWSServer, connectToPeer } from "./network/websocket.js";
import { startDiscovery } from "./network/discovery.js";
import { startUI } from "./tui/welcome.js"; // we will modify this

const username = os.userInfo().username;

/* -------------------------
   1. START WS SERVER
--------------------------*/
startWSServer(username, (event) => {
  console.log("WS EVENT:", event);

  // later connect to UI updates here
});

/* -------------------------
   2. START DISCOVERY
--------------------------*/
startDiscovery(username, (user) => {
  if (user.username === username) return;

  connectToPeer(user.ip, username, (msg) => {
    console.log("MSG:", msg);

    // later send to UI
  });
});

/* -------------------------
   3. START UI LAST
--------------------------*/
startUI();
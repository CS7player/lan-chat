import * as os from "node:os";
import { startWSServer, connectToPeer } from "./network/websocket.js";
import { startDiscovery } from "./network/discovery.js";
import { startUI } from "./tui/welcome.js";
import { addUser, removeUser } from "./state/chatState.js";

const username = os.userInfo().username;

console.log("🚀 App starting...");
console.log("Username:", username);

try {
  console.log("📡 Starting WS Server...");
  startWSServer(username, (event) => {
    console.log("WS EVENT:", event);
    if (event.type === "USER_JOIN") addUser(event);
    if (event.type === "CHAT") {}
    if (event.type === "PRIVATE_CHAT") {}
    if (event.type === "USER_LEAVE") removeUser(event);
  });

  console.log("🔍 Starting Discovery...");
  startDiscovery(username, (user) => {
    // console.log("DISCOVERY USER:", user);
    // if (user.username === username) return;
    connectToPeer(user.ip, username, (msg) => {
      console.log("MSG:", msg);
    });
  });

  console.log("🖥 UI starting...");
  startUI();

} catch (e) {
  console.error("❌ Fatal error:", e);
}
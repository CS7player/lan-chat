import os from "os";
import { startWSServer, connectToPeer } from "./network/websocket.js";
import { startDiscovery } from "./network/discovery.js";
import { startUI } from "./tui/welcome.js";
import { addUser, removeUser } from "./state/chatState.js";
const username = os.userInfo().username;

/* -START WS SERVER-*/
startWSServer(username, (event) => {
 if (event.type == "USER_JOIN") {
  addUser(event);
 }
 if (event.type == "CHAT") {

 }
 if (event.type == "PRIVATE_CHAT") {
  const userObj = { username: event['from'] }
  addMessage(userObj, event)
 }
 if (event.type == "USER_LEAVE") {
  removeUser(event)
 }
 // later connect to UI updates here
});

/* -START DISCOVERY-*/
startDiscovery(username, (user) => {
 if (user.username === username) return;
 connectToPeer(user.ip, username, (msg) => {
  console.log("MSG:", msg);
  // later send to UI
 });
});

/* -START UI LAST-*/
startUI();
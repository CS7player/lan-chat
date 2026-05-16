import WebSocket, { WebSocketServer } from "ws";
import { addMessage, chatState, removeUser, addUser } from "../state/chatState.js";
import { addPeer, removePeer, hasPeer, getPeers } from "./peers.js";
import { createAlertBox } from "../tui/alert.js";
import { clearFocus } from "../utils/screen.js";
import { startUI } from "../tui/welcome.js";

export function startWSServer(username) {

 try {
  const wss = new WebSocketServer({ port: 8080 });
  wss.on("listening", () => {
   console.log("WS LISTENING on 8080");
   startUI();
  });
  wss.on("error", (err) => {
   console.error("WS failed:", err);
  });
  wss.on("connection", (ws, req) => {
   const ip = req.socket.remoteAddress;
   ws.on("message", (raw) => {
    try {
     const data = JSON.parse(raw.toString());
     if (data.type === "INTRO") {
      addPeer(ip, {
       ws,
       username: data.username,
      });
      addUser({ username: data.username, ip });
      return;
     }
     if (data.type === "CHAT") {
      for (const [, peer] of getPeers()) {
       peer.ws.send(JSON.stringify(data));
      }
     }
     if (data.type === "PRIVATE_CHAT") {

     }
    } catch (e) {
     console.error("❌ MESSAGE ERROR:", e);
    }
   });

   ws.on("close", () => {
    const peer = getPeers().get(ip);
    removeUser(peer?.username)
    removePeer(ip);
   });
  });

 } catch (err) {
  console.error("❌ START ERROR:", err);
 }
}

export function connectToPeer(ip, username) {
 if (hasPeer(ip)) return;
 const ws = new WebSocket(`ws://${ip}:8080`);
 ws.on("open", () => {
  addPeer(ip, { ws, username: "unknown" });
  ws.send(JSON.stringify({
   type: "INTRO",
   username
  }));
 });

 ws.on("message", (raw) => {
  try {
   const data = JSON.parse(raw.toString());
   const userObj = { username: data["from"] }
   addMessage(userObj, data)
  } catch (err) {
   console.log(err);
  }
 });
 ws.on("close", () => { removePeer(ip); });
}

export function sendMessage(username, message) {
 const payload = JSON.stringify({
  type: "CHAT",
  from: username,
  message,
  timestamp: Date.now(),
 });
 for (const [, peer] of getPeers()) {
  peer.ws.send(payload);
 }
}

// send to specific peer
export function sendPrivateMessage(toIp, username, message) {
 const peer = getPeers().get(toIp);
 if (!peer) {
  clearFocus();
  createAlertBox("Selected User in Left.")
  return;
 }
 const payload = JSON.stringify({
  type: "PRIVATE_CHAT",
  from: chatState.whoami,
  message,
  timestamp: Date.now(),
 });
 peer.ws.send(payload);
}
// src/network/websocket.js

import WebSocket, { WebSocketServer } from "ws";

import {
  addPeer,
  removePeer,
  hasPeer,
  getPeers,
} from "./peers.js";

export function startWSServer(username, onMessage) {
  const wss = new WebSocketServer({
    port: 8080,
  });

  wss.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());

        // USER INTRO
        if (data.type === "INTRO") {
          addPeer(ip, {
            ws,
            username: data.username,
            hostname: data.hostname,
          });

          onMessage({
            type: "USER_JOIN",
            username: data.username,
            ip,
          });

          return;
        }

        // CHAT MESSAGE
        if (data.type === "CHAT") {
          onMessage(data);

          // broadcast
          for (const [, peer] of getPeers()) {
            peer.ws.send(JSON.stringify(data));
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    ws.on("close", () => {
      removePeer(ip);

      onMessage({
        type: "USER_LEAVE",
        ip,
      });
    });
  });

  console.log("WS running on 8080");
}

export function connectToPeer(ip, username, hostname, onMessage) {
  if (hasPeer(ip)) return;

  const ws = new WebSocket(`ws://${ip}:8080`);

  ws.on("open", () => {
    addPeer(ip, {
      ws,
      username: "unknown",
      hostname: "unknown",
    });

    ws.send(
      JSON.stringify({
        type: "INTRO",
        username,
        hostname,
      })
    );
  });

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      onMessage(data);
    } catch (err) {
      console.log(err);
    }
  });

  ws.on("close", () => {
    removePeer(ip);
  });
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
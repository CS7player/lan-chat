import { startWSServer, connectToPeer, sendMessage } from "./websocket.js";
import { setUsers, addMessage } from "../state/chatState.js";

export function initNetwork(username, onUserUpdate, onMessage) {
  startWSServer(username, (event) => {
    if (event.type === "USER_JOIN") {
      onUserUpdate();
    }

    if (event.type === "CHAT") {
      addMessage(event);
      onMessage(event);
    }
  });
}

export function sendChat(username, message) {
  sendMessage(username, message);
}
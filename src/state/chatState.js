import * as os from "node:os";
import { loadUsers } from "../tui/side-bar.js";
import { renderMessage } from "../tui/content.js";
import { sendPrivateMessage } from "../network/websocket.js";

export const chatState = {
 whoami: os.userInfo().username,
 users: [],
 messages: {},
 selectedUser: null,
};

export function addUser(user) {
 chatState.users.push(user);
 loadUsers()
}

export function removeUser(user) {
 loadUsers()
}

export function setSelectedUser(user) {
 chatState.selectedUser = user;
 if (!chatState.messages[user.username]) {
  chatState.messages[user.username] = [];
 }
}

export function addMessage(user, msg) {
 const key = user.username || "global";
 if (!chatState.messages[key]) {
  chatState.messages[key] = [];
 }
 chatState.messages[key].push(msg);
 renderMessage(msg);
}

export function sendMessage(user, msg) {
 sendPrivateMessage(user.ip, user.username, msg)
 const msgObj = {
  from: "You",
  to: user.username,
  message: msg,
  time: Date.now(),
 };
 addMessage(user, msgObj);
}
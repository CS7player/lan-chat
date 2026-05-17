import * as os from "os";
import { loadUsers } from "../tui/side-bar.js";
import { renderMessage, renderContent } from "../tui/content.js";
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

export function removeUser(username) {
 chatState.users = chatState.users.filter(user => user.username !== username);
 renderContent("no user Selected!!");
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
 if (chatState.selectedUser && chatState.selectedUser.username == msg.from) {
  renderMessage(msg);
 }
 if (msg.from == "You") {
  renderMessage(msg);
 }
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
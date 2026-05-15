import blessed from "blessed";
import { screen } from "../utils/screen.js";
import { color } from '../utils/contants.js';
import { chatState, addMessage } from "../state/chatState.js";
import { renderMsgBar } from "./msg-bar.js";

const contentBox = blessed.box({
 top: 1,
 left: "20%",
 width: "80%",
 height: "100%-6",
 label: " Chat ",
 tags: true,
 border: { type: "line" },
 scrollable: true,
 alwaysScroll: true,
 scrollbar: {
  ch: "│",
  style: { fg: color.yellow },
 },
 style: {
  fg: color.white,
  bg: color.black,
  border: { fg: color.yellow },
 },
 content: " NO one is Selected",
});

/* -RENDER CHAT CONTAINER-*/
export const renderContent = (text = "") => {
 contentBox.setLabel(text);
 screen.append(contentBox);
 renderMsgBar();
 screen.render();
};

/* -CLEAR CHAT-*/
export const clearChat = () => {
 contentBox.setContent("");
 screen.render();
};

/* -MESSAGE RENDERER (LEFT / RIGHT)-*/
export const renderMessage = (msg) => {
 const isMe = msg.from === "You";
 const formatted = isMe
  ? `{right}${msg.from}: ${msg.message}{/right}`
  : `{left}${msg.from}: ${msg.message}{/left}`;
 const current = contentBox.getContent();
 contentBox.setContent(current + "\n" + formatted);
 contentBox.setScrollPerc(100);
 screen.render();
};

/* -LOAD CHAT HISTORY (OPTIONAL)-*/
export const loadChatHistory = (user) => {
 const msgs = chatState.messages?.[user.username] || [];
 contentBox.setContent("");
 msgs.forEach(renderMessage);
 screen.render();
};
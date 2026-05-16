import blessed from "blessed";
import { addFocusBtn, screen, focusButton, screenRefresh, clearFocus } from "../utils/screen.js";
import { color, tabsfocus } from '../utils/contants.js';
import { chatState, sendMessage } from "../state/chatState.js";
import { renderMessage } from "./content.js";
import { createAlertBox } from "./alert.js";

/* -INPUT BAR CONTAINER-*/
const inputBar = blessed.box({
 bottom: 0,
 left: "20%",
 width: "80%",
 height: 5,
 label: "{yellow-fg} Use TAB to Navigate {/yellow-fg}",
 tags: true,
 border: {
  type: "line"
 },
 style: {
  fg: color.white,
  bg: color.black,
  border: {
   fg: color.green
  }
 }
});

/* -INPUT BOX-*/
const inputBox = blessed.textbox({
 parent: inputBar,
 left: 0,
 top: 0,
 height: 3,
 width: "85%",
 keys: true,
 mouse: true,
 border: { type: "line" },
 style: {
  fg: color.white,
  bg: color.black,
  border: { fg: color.green },
  focus: { border: { fg: color.purple } },
  hover: { border: { fg: color.purple } }
 },
});

/* -SEND BUTTON-*/
const sendButton = blessed.button({
 parent: inputBar,
 right: 0,
 top: 0,
 height: 3,
 width: 10,
 content: " Send ",
 mouse: true,
 keys: true,
 align: "center",
 shrink: true,
 border: { type: "line", },
 style: {
  fg: color.black,
  bg: color.green,
  border: { fg: color.white, },
  focus: { border: { fg: color.purple }, bg: color.yellow, fg: color.green },
  hover: { border: { fg: color.purple }, bg: color.yellow, fg: color.green }
 },
});

/* -SEND MESSAGE HANDLER-*/
const handleSend = () => {
 inputBox.cancel();
 const text = inputBox.getValue().trim();
 if (!text) {
  clearFocus();
  // createAlertBox("NO Text is Entered!");
  return;
 }
 const user = chatState.selectedUser;
 if (!user) {
  clearFocus();
  createAlertBox("NO User is Selected!");
  return;
 }
 sendMessage(user, text);
 inputBox.clearValue();
};

/* -EVENTS-*/
sendButton.on("press", handleSend);
inputBox.on('click', () => {
 inputBox.focus();
 inputBox.readInput(() => { });
});
inputBox.on('submit', handleSend);
inputBox.key('tab', () => {
 inputBox.cancel();
 clearFocus();
 return false;
});

/* -RENDER-*/
export const renderMsgBar = () => {
 if (!screen.children.includes(inputBar)) {
  addFocusBtn({ id: 8, btn: inputBox });
  addFocusBtn({ id: 9, btn: sendButton });
  screen.append(inputBar);
 }
};
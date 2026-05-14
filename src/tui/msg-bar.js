import blessed from "blessed";
import { screen } from "../utils/screen.js";
import { chatState, addMessage } from "../state/chatState.js";
import { renderMessage } from "./content.js";

/* ---------------------------
   INPUT BAR CONTAINER
----------------------------*/
const inputBar = blessed.box({
  bottom: 0,
  left: "20%",
  width: "80%",
  height: 3,
  style: {
    bg: "black",
  },
});

/* ---------------------------
   INPUT BOX
----------------------------*/
const inputBox = blessed.textbox({
  parent: inputBar,
  left: 0,
  top: 0,
  height: 3,
  width: "85%",
  inputOnFocus: true,
  border: { type: "line" },
  style: {
    fg: "white",
    bg: "black",
    border: { fg: "green" },
    focus: { border: { fg: "yellow" } },
  },
});

/* ---------------------------
   SEND BUTTON
----------------------------*/
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

  border: {
    type: "line",
  },

  style: {
    fg: "white",
    bg: "blue",
    border: {
      fg: "white",
    },
  },
});

/* ---------------------------
   SEND MESSAGE HANDLER
----------------------------*/
const handleSend = () => {
  const text = inputBox.getValue().trim();
  if (!text) return;

  const user = chatState.selectedUser;
  if (!user) return;

  const msg = {
    from: "You",
    to: user.username,
    message: text,
    time: Date.now(),
  };

  // store message
  addMessage(user, msg);

  // render RIGHT side
  renderMessage(msg);

  // TODO: send via websocket
  // sendPrivateMessage(user, msg);

  inputBox.clearValue();
  inputBox.focus();
};

/* ---------------------------
   EVENTS
----------------------------*/
sendButton.on("press", handleSend);

inputBox.key("enter", handleSend);

/* ---------------------------
   RENDER
----------------------------*/
export const renderMsgBar = () => {
  screen.append(inputBar);
  inputBox.focus();
};
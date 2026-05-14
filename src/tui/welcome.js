import blessed from 'blessed';
import { screen, screenClear, screenExit, screenRefresh, addFocusBtn, removeFocusBtn } from "../utils/screen.js";
import { displayDashboard } from "./layout.js"
import { color } from '../utils/contants.js';

const welcome_box = blessed.box({
 top: 'center',
 left: 'center',
 width: 50,
 height: 10,
 border: {
  type: 'line'
 },
 align: 'center',
 content: `

 Welcome to Chat TUI`,
 style: {
  fg: color.white,
  bg: color.black,
  border: {
   fg: color.green
  }
 }
});

// YES button
const yesBtn = blessed.button({
 parent: welcome_box,
 mouse: true,
 keys: true,
 shrink: true,
 padding: {
  left: 2,
  right: 2
 },
 left: 10,
 bottom: 2,
 name: 'yes',
 content: 'YES',
 style: {
  bg: color.green,
  fg: color.black,
  focus: {
   bg: color.purple,
   fg: color.black,
   bold: true
  },
  hover: {
   bg: color.purple
  }
 }
});

// NO button
const noBtn = blessed.button({
 parent: welcome_box,
 mouse: true,
 keys: true,
 shrink: true,
 padding: {
  left: 2,
  right: 2
 },
 right: 10,
 bottom: 2,
 name: 'no',
 content: 'NO',
 style: {
  bg: color.red,
  fg: color.black,
  focus: {
   bg: color.purple,
   fg: color.black,
   bold: true
  },
  hover: {
   bg: color.purple
  }
 }
});

// YES event
yesBtn.on('press', () => {
 screenClear()
 removeFocusBtn(yesBtn)
 removeFocusBtn(noBtn)
 displayDashboard()
});

// NO event
noBtn.on('press', () => {
 screenExit();
});

export const startUI = () => {
 screen.append(welcome_box);
 yesBtn.focus();
 addFocusBtn({ btn: yesBtn })
 addFocusBtn({ btn: noBtn })
 screenRefresh();
}



import blessed from 'blessed';
import { screen, addFocusBtn } from '../utils/screen.js';
import { showDialogBox } from '../utils/dialog.js';
import { color } from '../utils/contants.js';
import { clearFocus } from "../utils/screen.js";

// HEADER
const header = blessed.box({
 top: 0,
 left: 0,
 width: '100%',
 height: 1,
 style: {
  bg: color.green,
 }
});

const title = blessed.text({
 parent: header,
 top: 0,
 left: 'center',
 width: 'shrink',
 height: 1,
 align: 'center',
 content: 'cHat TUI',
 style: {
  fg: color.yellow,
  bg: color.green,
  bold: true,
 }
});

// Exit button 
const exitBtn = blessed.button({
 parent: header,
 content: ' X ',
 top: 0,
 right: 2,
 height: 1,
 shrink: true,
 mouse: true,
 keys: true,
 style: {
  fg: color.white, bg: color.red,
  focus: { fg: color.white, bg: color.purple },
  hover: { fg: color.white, bg: color.purple },
  active: { fg: color.white, bg: color.red }
 }
});

exitBtn.on('press', () => {
 clearFocus();
 showDialogBox();
 screen.render();
});

export const renderHeader = () => {
 addFocusBtn({ id: 4, btn: exitBtn })
 screen.append(header);
}
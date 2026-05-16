import blessed from 'blessed';
import { screen, screenRefresh, addFocusBtn, removeFocusBtn, screenExit } from './screen.js';
import { color } from './contants.js';

const dialogBox = blessed.box({
 top: 'center',
 left: 'center',
 width: 40,
 height: 7,
 border: {
  type: 'line'
 },
 style: {
  fg: color.white,
  bg: color.black,
  border: { fg: color.yellow }
 },
 hidden: true
});

const dialogText = blessed.text({
 parent: dialogBox,
 top: 1,
 left: 'center',
 content: 'Are you sure you want to exit?',
 style: {
  fg: color.white,
  bg: color.black
 }
});

const okBtn = blessed.button({
 parent: dialogBox,
 content: ' ok ',
 bottom: 1,
 left: 8,
 shrink: true,
 mouse: true,
 style: {
  fg: color.white,
  bg: color.red,
  focus: { bg: color.purple },
  hover: { bg: color.purple }
 }
});

const noBtn = blessed.button({
 parent: dialogBox,
 content: ' No ',
 bottom: 1,
 right: 8,
 shrink: true,
 mouse: true,
 style: {
  fg: color.black,
  bg: color.green,
  focus: { bg: color.purple },
  hover: { bg: color.purple }
 }
});

okBtn.on('press', () => {
 dialogBox.hide();
 removeFocusBtn(okBtn);
 removeFocusBtn(noBtn);
 screen.remove(dialogBox);
 screenExit()
 disableModalMode();
 screenRefresh();
});

noBtn.on('press', () => {
 dialogBox.hide();
 removeFocusBtn(5);
 removeFocusBtn(6);
 screen.remove(dialogBox);
 disableModalMode();
 screenRefresh();
});

export function showDialogBox() {
 screen.append(dialogBox)
 addFocusBtn({ id: 5, btn: okBtn })
 addFocusBtn({ id: 6, btn: noBtn })
 okBtn.focus();
 dialogBox.show();
 enableModalMode();
 dialogBox.focus();
 dialogBox.setFront();
 screenRefresh();
}

function enableModalMode() {
 screen.children.forEach(child => {
  if (child !== dialogBox) {
   child.hidden = true;
  }
 });
}

function disableModalMode() {
 screen.children.forEach(child => {
  child.hidden = false;
 });
}

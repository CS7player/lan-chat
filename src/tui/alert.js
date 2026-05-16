import blessed from "blessed";
import { screen, screenRefresh, addFocusBtn, removeFocusBtn } from "../utils/screen.js";
import { color, tabsfocus } from "../utils/contants.js";
/**
 * Creates a simple alert modal with OK button
 * @param {string} message
 * @param {Function} onClose
 */
export const createAlertBox = (
 message = 'Something happened!',
 onClose = null
) => {
 const overlay = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  style: {
   bg: color.black,
   transparent: false
  }
 });

 // alert container
 const alertBox = blessed.box({
  parent: overlay,
  top: 'center',
  left: 'center',
  width: '50%',
  height: 9,
  border: {
   type: 'line'
  },
  tags: true,
  label: ' Alert ',
  style: {
   fg: color.white,
   bg: color.black,
   border: {
    fg: color.purple
   }
  }
 });

 // message text
 blessed.text({
  parent: alertBox,
  top: 2,
  left: 2,
  width: '90%',
  align: 'center',
  content: message,
  style: {
   fg: color.white
  }
 });

 // OK button
 const okBtn = blessed.button({
  parent: alertBox,
  bottom: 1,
  left: 'center',
  width: 10,
  height: 1,
  mouse: true,
  keys: true,
  shrink: true,
  name: 'ok-button',
  content: ' OK ',
  style: {
   fg: color.black,
   bg: color.red,
   focus: {
    fg: color.white,
    bg: color.blue
   },
   hover: {
    fg: color.white,
    bg: color.blue
   }
  }
 });

 // add to focus system
 okBtn.focus();
 addFocusBtn({ id: 99, btn: okBtn });
 tabsfocus.btnIndex = tabsfocus.btns.findIndex(b => b.id === 99);
 tabsfocus.istoggle = false;

 const closeAlert = () => {
  tabsfocus.istoggle = true;
  overlay.destroy();
  if (onClose && typeof onClose === 'function') { onClose(); }
  removeFocusBtn(99);
  screenRefresh();
 };

 okBtn.on('press', closeAlert);
 // ESC closes alert too
 alertBox.key(['escape'], closeAlert);
 screenRefresh();
 return {
  alertBox,
  closeAlert
 };
};
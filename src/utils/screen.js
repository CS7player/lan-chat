import blessed from 'blessed';
import { tabsfocus } from '../utils/contants.js';

export const screen = blessed.screen({
 smartCSR: true,
 mouse: true,
 title: "Chat TUI"
})

screen.key(['escape', 'q', 'C-c'], () => {
 screenExit();
});

export const screenRefresh = () => { screen.render(); }
export const screenExit = () => {
 screen.destroy();
 process.exit(0);
}
export const screenClear = () => {
 [...screen.children].forEach(child => child.destroy());
}

export const addFocusBtn = (btn) => {
 const exists = tabsfocus.btns.some(b => b.btn == btn.btn);
 if (!exists)
  tabsfocus.btns.push(btn);
}

export const removeFocusBtn = (btn) => {
 const eleIndex = tabsfocus.btns.findIndex(b => b.btn == btn.btn);
 if (eleIndex != -1)
  tabsfocus.btns.splice(eleIndex, 1);
};

// Helper to focus button
const focusButton = (index) => {
  if (!tabsfocus.btns.length) return;
  const safeIndex = index % tabsfocus.btns.length;
  tabsfocus.btnIndex = safeIndex;
  const item = tabsfocus.btns[safeIndex];
  if (!item || !item.btn) return;
  item.btn.focus();
  screenRefresh();
};

// TAB key
screen.key(['tab'], () => {
  if (!tabsfocus.btns.length) return;
  tabsfocus.btnIndex =
    (tabsfocus.btnIndex + 1) % tabsfocus.btns.length;
  focusButton(tabsfocus.btnIndex);
});

// ENTER key
screen.key(['enter'], () => {
  const item = tabsfocus.btns[tabsfocus.btnIndex];
  if (!item || !item.btn) return;
  item.btn.emit('press');
});





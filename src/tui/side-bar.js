import blessed from 'blessed';
import { addFocusBtn, screen, screenRefresh } from '../utils/screen.js';
import { color } from '../utils/contants.js';
import { renderContent, clearChat, loadChatHistory } from './content.js';
import { chatState } from '../state/chatState.js';
import { setSelectedUser } from '../state/chatState.js';

// SIDEBAR
const sidebar = blessed.box({
 top: 1,
 left: 0,
 width: '20%',
 height: '100%-1',
 label: ' Users (↑/↓ nav) ',
 border: { type: 'line' },
 style: {
  fg: color.white,
  bg: color.black,
  border: { fg: color.green },
  focus: { border: { fg: color.purple } },
  hover: { border: { fg: color.purple } }
 }
});

const spinnerFrames = ['|', '/', '-', '\\'];
let i = 0;
const loader = blessed.text({
 parent: sidebar,
 top: 1,
 left: 'center',
 content: 'Loading users |',
 style: { fg: color.yellow }
});

const loaderInterval = setInterval(() => {
 i = (i + 1) % spinnerFrames.length;
 loader.setContent(`Loading users ${spinnerFrames[i]}`);
 sidebar.screen.render();
}, 120);

function stopLoader() {
 clearInterval(loaderInterval);
 loader.hide();
}

const userRows = [];
let selectedIndex = 0;

const renderUsers = (users, callBack) => {
 loader.hide();
 userRows.forEach(row => row.destroy());
 userRows.length = 0;
 users.forEach((user, index) => {
  const row = blessed.box({
   parent: sidebar,
   top: index * 3 + 1,
   width: '94%',
   height: 3,
   keys: true,
   mouse: true,
   clickable: true,
   focusable: true,
   content: user.username,
   border: { type: 'line' },
   style: {
    fg: color.white,
    bg: color.black,
    border: { fg: color.green },
    focus: { border: { fg: color.purple }, bg: color.green, fg: color.black },
    hover: { border: { fg: color.purple }, bg: color.green, fg: color.black }
   }
  });
  row.on('click', () => callBack(user, row));
  row.key('enter', () => callBack(user, row));
  userRows.push(row);
 });
 sidebar.screen.render();
};

const handleUserClick = (user, box) => {
 box.focus();
 setSelectedUser(user);
 clearChat();
 renderContent(`Chat with ${user.username}`);
 loadChatHistory(user);
 screenRefresh();
};

export const loadUsers = () => {
 loader.show();
 stopLoader()
 renderUsers(chatState.users, handleUserClick);
}

export const renderSideBar = () => {
 screen.append(sidebar);
 addFocusBtn({ id: 7, btn: sidebar })
 loadUsers();
}

const isSidebarFocused = () => {
 let node = screen.focused;
 while (node) {
  if (node === sidebar) {
   return true;
  }
  node = node.parent;
 }
 return false;
};

screen.key(['up'], () => {
 if (!isSidebarFocused()) return;
 selectedIndex = (selectedIndex - 1 + userRows.length) % userRows.length;
 userRows[selectedIndex].focus();
 screen.render();
});

screen.key(['down'], () => {
 if (!isSidebarFocused()) return;
 selectedIndex = (selectedIndex + 1) % userRows.length;
 userRows[selectedIndex].focus();
 screen.render();
});
import blessed from 'blessed';
import { addFocusBtn, screen, screenRefresh } from '../utils/screen.js';
import { color } from '../utils/contants.js';
import { renderContent, clearChat  } from './content.js';
import { chatState } from '../state/chatState.js';
import { setSelectedUser } from '../state/chatState.js';
// SIDEBAR
const sidebar = blessed.box({
 top: 1,
 left: 0,
 width: '20%',
 height: '100%-1',
 label: ' Users ',
 border: { type: 'line' },
 style: {
  fg: color.white,
  bg: color.black,
  border: { fg: color.green }
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

const renderUsers = (users, callBack) => {
  loader.hide();
  sidebar.children.forEach(child => {
    if (child !== loader) child.destroy();
  });
  users.forEach((user, index) => {
    const row = blessed.box({
      parent: sidebar,
      top: index * 3,
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
        focus: {
          border: { fg: color.yellow },
          bg: color.black
        },
        hover: {
          fg: color.green,
          border: { fg: color.yellow }
        }
      }
    });
    row.on('click', () => callBack(user));
    addFocusBtn({ btn: row });
  });

  sidebar.screen.render();
};

const handleUserClick = (user) => {
  setSelectedUser(user);
  clearChat ();
  renderContent(`Chat with ${user.username}`);
  screenRefresh();
};

const loadUsers = () => {
 loader.show();
 setTimeout(() => {
  stopLoader()
  renderUsers(chatState.users, handleUserClick);
 }, 1500);
}

export const renderSideBar = () => {
 screen.append(sidebar);
 loadUsers();
}
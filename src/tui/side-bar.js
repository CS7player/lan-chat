import blessed from 'blessed';
import { screen, screenRefresh } from '../utils/screen.js';
import { color, users } from '../utils/contants.js';
import { renderContent, removeContent } from './content.js';
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
 users.forEach((user, index) => {
  const row = blessed.box({
   parent: sidebar,
   top: index * 3,
   width: '94%',
   height: 3,
   mouse: true,
   keys: true,
   content: user.username,
   border: {
    type: 'line'
   },
   style: {
    fg: color.white,
    bg: color.black,
    border: {
     fg: color.green
    },
    focus: {
     border: {
      fg: color.yellow
     },
     bg: color.black
    },
    hover: {
     fg: color.green,
     border: {
      fg: color.yellow
     }
    }
   }
  });
  row.on('click', () => callBack(user));
 });
 sidebar.screen.render();
}

const handleUserClick = (user) => {
 removeContent();
 renderContent(`Selected user:  ${user.username}`);
 screenRefresh();
}

const loadUsers = () => {
 loader.show();
 setTimeout(() => {
  stopLoader()
  renderUsers(users, handleUserClick);
 }, 1500);
}

export const renderSideBar = () => {
 screen.append(sidebar);
 loadUsers();
}
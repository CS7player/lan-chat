import blessed from 'blessed';
import { screen } from '../utils/screen.js';

// MAIN CONTENT

const contentBox = blessed.box({
 top: 1,
 left: '20%',
 width: '80%',
 height: '100%-4',
 label: ' Content ',
 tags: true,
 border: {
  type: 'line'
 },
 scrollable: true,
 alwaysScroll: true,
 content: `
  Welcome Chandra 👋

  This is the main content area.

  You can:
  - Render chat UI
  - Show tables
  - Add forms
  - Create logs
  - Build dashboards

  Blessed is very powerful 🚀
  `,
 style: {
  fg: 'white',
  bg: 'black',
  border: {
   fg: 'yellow'
  }
 }
});

// Bottom input container
const inputBar = blessed.box({
  bottom: 0,
  left: '20%',
  width: '80%',
  height: 3,
  style: {
    bg: 'black'
  }
});

// Text input field
const inputBox = blessed.textbox({
  parent: inputBar,
  left: 0,
  top: 0,
  height: 3,
  width: '85%',
  inputOnFocus: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'green'
    }
  }
});

// Send button (right corner)
const sendButton = blessed.button({
  parent: inputBar,
  right: 0,
  top: 0,
  height: 3,
  width: 10,
  content: ' Send ',
  align: 'center',
  mouse: true,
  keys: true,
  shrink: true,
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: 'blue'
    },
    focus: {
      bg: 'green'
    },
    hover: {
      bg: 'green'
    }
  }
});


export const renderContent = (text = "") => {
 if (text.length > 0) {
  contentBox.setContent(text);
 }

 screen.append(contentBox);
 screen.append(inputBar)
}

export const removeContent = () => {
 screen.remove(contentBox);
}
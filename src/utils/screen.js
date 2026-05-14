import blessed from 'blessed';

export const screen = blessed.screen({
 smartCSR: true,
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





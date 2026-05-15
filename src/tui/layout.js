import { renderHeader } from './header.js';
import { renderSideBar } from './side-bar.js';
import { renderContent } from './content.js';
import { screenRefresh } from '../utils/screen.js';
// Append all
export const displayDashboard = () => {
 renderHeader();
 renderSideBar();
 renderContent(" Chat ");
 screenRefresh();
}


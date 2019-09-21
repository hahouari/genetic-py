import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  MenuItem
} from 'electron';
/******************* MAIN WINDOW HANDLING *******************
 *************************************************************/
/**
 * main window
 */
let mainWindow: BrowserWindow;
// let timeProcess: ChildProcess;

/**
 * @param filePath  string  path to an HTML file relative to the root of your application
 * @param options   constructor options for the browser window returned
 */
const createWindow = (
  filePath: string,
  {
    minWidth,
    minHeight,
    width,
    height,
    resizable,
    minimizable,
    maximizable,
    parent,
    frame
  }: BrowserWindowConstructorOptions = {}
): BrowserWindow => {
  let targetWindow = new BrowserWindow({
    minWidth,
    minHeight,
    width,
    height,
    resizable,
    minimizable,
    maximizable,
    parent,
    frame,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  targetWindow.loadFile(filePath);

  targetWindow.once('ready-to-show', () => targetWindow.show());

  targetWindow.on('enter-full-screen', () => {
    targetWindow.setAutoHideMenuBar(true);
    targetWindow.setMenuBarVisibility(false);
  });

  targetWindow.on('leave-full-screen', () => {
    targetWindow.setAutoHideMenuBar(false);
    targetWindow.setMenuBarVisibility(true);
  });

  targetWindow.on('close', () => {
    mainWindow.webContents.send('pyshell');
  });

  targetWindow.once('closed', () => {
    targetWindow = null;
  });
  return targetWindow;
};

app.once('ready', () => {
  mainWindow = exports.mainWindow = createWindow('app/index.html', {
    minWidth: 580,
    minHeight: 430
  });

  const menubar = require('./menubar') as Menu;
  menubar.items[process.platform == 'darwin' ? 3 : 2].submenu.append(
    new MenuItem({
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        mainWindow.webContents.send('pyshell');
        mainWindow.webContents.reload();
      }
    })
  );

  app.applicationMenu = menubar;
});

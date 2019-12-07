const { app, BrowserWindow, Menu } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');



//NOTES
//- Read Webpack documentation/ guide
//- look at other grojects and guides
// entry points
// target
//watching files
// css, images
// resolve
// Hot Module Replacement











let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 750, 
    height: 650,
    //titleBarStyle: 'hidden', // 'hidden-inset' - "removes" titlebar on MacOS 
    show: false, 
    webPreferences: {
        nodeIntegration: true // MUST ALWAYS BE TRUE
      }});
  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../index.html')}`);// make sure webpack builds to "build folder"
//   if (isDev) { build/index.html
//     // Open the DevTools.
//     //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
//     mainWindow.webContents.openDevTools();
//   }
  mainWindow.on('closed', () => mainWindow = null);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
});
}


// const dockMenu = Menu.buildFromTemplate([
//     {
//         label: 'New Window',
        
//     }, {
//         label: 'New Window with Settings',
//         submenu: [
//           { label: 'Basic' },
//           { label: 'Pro' }
//         ]
//     }])

// app.dock.setMenu(dockMenu);


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();

    
  }
});
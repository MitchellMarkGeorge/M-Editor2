const { app, BrowserWindow, Menu , ipcMain, dialog} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const { GET_PROJECT_PATH, RECEIVED_PROJECT_PATH} = require('./utils/constants');
// const FileTree = require('./src/Filetree').FileTree;
const os = require('os')



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
    width: 900, // set min and max values
    height: 700,
    backgroundColor: '#2c2f33',
    frame: false,
    // might make frameless
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

ipcMain.on(GET_PROJECT_PATH, (event, arg) => {
  console.log('open file dialog');
  dialog.showOpenDialog(mainWindow, {title: 'Choose Project', defaultPath: os.homedir(), properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate']})
  .then((result) => {
    if (result.canceled || result.filePaths[0] === os.homedir() || result.filePaths.length === 0){ // althoug the filepath will not be 0
      console.log('CANCELED!!')
      return;
    } else {
      let filepath = result.filePaths;
      mainWindow.webContents.send(RECEIVED_PROJECT_PATH, filepath)
      // let file_tree = new FileTree(filepath, path.basename(filepath));
      // file_tree.build();
      // console.log(filepath);
    }
  }).catch(err => {
    console.error(err);
  })
})


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
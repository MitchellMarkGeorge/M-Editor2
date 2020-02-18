const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const { GET_PROJECT_PATH, RECEIVED_PROJECT_PATH, SEND_SAVE_FILE_SIGNAL, RECEIVED_SAVE_FILE_SIGNAL, CANCELED } = require('./utils/constants');
// const FileTree = require('./src/Filetree').FileTree;
const os = require('os');

// NOTES
// - Read Webpack documentation/ guide
// - look at other grojects and guides
// entry points
// target
// watching files
// css, images
// resolve
// Hot Module Replacement

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900, // set min and max values
    height: 800,

    title: 'M-Editor',
    backgroundColor: '#2c2f33',
    // frame: false,
    // titleBarStyle: 'hidden',
    // might make frameless
    // titleBarStyle: 'hidden', // 'hidden-inset' - "removes" titlebar on MacOS
    show: false,
    webPreferences: {
      nodeIntegration: true // MUST ALWAYS BE TRUE
    }
  });
  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, 'build/index.html')}`);// make sure webpack builds to "build folder"
  //   if (isDev) { build/index.html
  //     // Open the DevTools.
  //     //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
  //     mainWindow.webContents.openDevTools();
  //   }
  mainWindow.on('closed', () => mainWindow = null);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (e) => {
    warnUser(e);
  });
}

// app.on('before-quit', (e) => {
//   warnUser(e)

// })

function warnUser (event) {
  const choice = dialog.showMessageBox(
    {
      type: 'question',
      buttons: ['No', 'Yes'],
      title: 'Confirm',
      message: 'Are you sure you want to quit? You might have some unsaved changed.'
    });

  choice.then(result => {
    console.log(result);
    if (result.response == 0) {
      event.preventDefault();
    }
  });
}

ipcMain.on(GET_PROJECT_PATH, (event, arg) => {
  console.log('open file dialog');
  dialog.showOpenDialog(mainWindow, { title: 'Choose Project', defaultPath: os.homedir(), properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate'] })
    .then((result) => {
      if (result.canceled || result.filePaths[0] === os.homedir() || result.filePaths.length === 0) { // althoug the filepath will not be 0
        console.log('CANCELED!!');
        mainWindow.webContents.send(CANCELED, '');
        // return;
      } else {
        const filepath = result.filePaths;
        mainWindow.webContents.send(RECEIVED_PROJECT_PATH, filepath);
        // let file_tree = new FileTree(filepath, path.basename(filepath));
        // file_tree.build();
        // console.log(filepath);
      }
    }).catch(err => {
      console.error(err);
    });
});

ipcMain.on(SEND_SAVE_FILE_SIGNAL, (event, arg) => {
  mainWindow.webContents.send(RECEIVED_SAVE_FILE_SIGNAL, '');
});

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

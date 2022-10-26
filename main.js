// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, Menu} = require('electron')

const path = require('path')
const windowStateKeeper = require('electron-window-state');
const db = require('./manageDB')
const {PosPrinter} = require("electron-pos-printer");

let mainWindow, card_clicked, student_data, isedit = false, ishistory = false;


ipcMain.on('set-var-false', e=>{
  ishistory = false,
  isedit = false
})


ipcMain.on('edit-info', e=>{
  mainWindow.loadFile('renderer/add.html')
  isedit = true
})

ipcMain.handle('get-edit-info', e=>{
  if(isedit){
    return [true, student_data]
  }
  else{
    return [false, []]
  }
})

ipcMain.on('clicked-card', (e, card)=>{
  card_clicked = card
})

ipcMain.handle('get-card-clicked', e=>{
  return card_clicked;
})

ipcMain.on('print-details', (e, data, options)=>{

  PosPrinter.print(data, options).catch(err=> console.log(err))
})


ipcMain.on('show-delete-message-dialog', (e, con)=>{
  dialog.showMessageBox({
    title: 'Delete',
    type: 'question',
    message: 'Do you want to delete this student record?',
    detail: 'Note: Deletion of student record is irreversible',
    buttons: ['Cancel', 'Delete'],
    noLink: true
  }).then(value=>{
    // return value.response
    if (value.response) {
      if (con){
        db.deleteRecord('student_data', student_data.id)
        // getCurrentWindow().reload()
        e.sender.send('refresh-page')

      }
      else{
      e.sender.send('delete-dialog-response', value.response)
      } 
    }
  })
})


ipcMain.on('show-context-menu', (event, item) => {
  student_data = item
  const template = [
    {
      label: 'Open',
      click: () => { event.sender.send('context-menu-open') }
    },
    { type: 'separator' },
    {
      label: 'Delete',
      click: () => { event.sender.send('context-menu-delete') }
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})

ipcMain.on('get-img-path', e=>{
  dialog.showOpenDialog({
    title: 'Select Image',
    filters: [
      { name: 'Images', extensions: ['jpeg', 'jpg', 'png'] },
    ],
    properties: ['openFile'],
    buttonLabel: 'Select'
  }).then(results=>{
    if(!results.canceled) e.reply('img-path', results.filePaths)
  })
})

ipcMain.handle('get-userdata-path', (e, arg) => {
let userDataPath = app.getPath('userData')
return userDataPath
})


ipcMain.on('change-file', (e, item, ishstry)=>{
  mainWindow.loadFile('renderer/student_detail.html')
  if (item != ''){
    student_data = item
    if (ishstry) ishistory = true
  }
  
})

ipcMain.handle('get-student-data', e=>{
  return [student_data, ishistory];
})

function createWindow () {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1130,
    defaultHeight: 700
  });


  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y:mainWindowState.y,
    minWidth: 1130,
    minHeight: 650,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('renderer/index.html')

  mainWindowState.manage(mainWindow);

  mainWindow.on('ready-to-show', e=>{
    mainWindow.show()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // console.log(mainWindow.webContents.getPrinters())
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  db.hasTable('student_data', app.getPath('userData'))
  db.hasTable('history', app.getPath('userData'))
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

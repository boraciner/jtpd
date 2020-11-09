const { app, BrowserWindow, ipcMain } = require('electron')
const SerialPort = require('serialport')
var usb = require('usb')
const { autoUpdater } = require('electron-updater');
const { Menu, Tray } = require('electron');
const path = require('path');




let PelcoDStop = new Uint8Array([0xFF,0x01,0x00,0x00,0x00,0x00,0x01]);
let PelcoDUp = new Uint8Array([0xFF,  0x01,  0x00,  0x08,  0x00,	 0x30,  0x39]);
let PelcoDUpRight = new Uint8Array([0xFF,  0x01,  0x00,  0x0A,  0x30, 0x30,  0x6B]);
let PelcoDUpLeft = new Uint8Array([0xFF,  0x01,  0x00,  0x0C,  0x30, 0x30,  0x6D]);
let PelcoDRight = new Uint8Array([0xFF,  0x01,  0x00,  0x02,  0x30, 0x00,  0x33]);
let PelcoDLeft = new Uint8Array([0xFF,  0x01,  0x00,  0x04,  0x30, 0x00,  0x35]);
let PelcoDDown = new Uint8Array([0xFF,  0x01,  0x00,  0x10,  0x00,	0x30,  0x41]);
let PelcoDDownRight = new Uint8Array([0xFF,  0x01,  0x00,  0x12,  0x30, 0x30,  0x73]);
let PelcoDDownLeft = new Uint8Array([0xFF,  0x01,  0x00,  0x14,  0x30, 0x30,  0x75]);
let JoystickDirection = "";
let SelectedJoystick = {}
let totalJoyDevices;

function uncomplement(val, bitwidth) {
  var isnegative = val & (1 << (bitwidth - 1));
  var boundary = (1 << bitwidth);
  var minval = -boundary;
  var mask = boundary - 1;
  return isnegative ? minval + (val & mask) : val;
}
function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}


function createTray() {
  const iconPath = path.join(__dirname, 'assets/trayIcon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Joy To Pelco-D');
  tray.setContextMenu(contextMenu);
}

let win = {};
function createWindow () {
  createTray();
  
  win = new BrowserWindow({
    width: 200,
    height: 200,
    webPreferences: {
      nodeIntegration: true
    },
    transparent: true,
    frame: false
  })
  win.setAlwaysOnTop(true, 'screen');
  win.setResizable(false);
  win.loadFile('index.html')
  //win.webContents.openDevTools()
  autoUpdater.checkForUpdatesAndNotify();
  win.setSkipTaskbar(true);
  
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const window = BrowserWindow.getFocusedWindow();

ipcMain.on('JoyStartStop', (event, arg) => {
  console.log(`JoyStartStop Received reply from web page: ${arg}`);
  if(arg === "end"){
    if(!isEmptyObject(port))
    {
      currentJoystickDirection = "s"
      SendJoystickDirectionCommand(currentJoystickDirection)
    }  
  }
  
});

function SendJoystickDirectionCommand(JoystickDirection){
<<<<<<< HEAD
  console.log("Changed!!!!!!! ",JoystickDirection)
=======
  console.log("Changed ",JoystickDirection)
>>>>>>> 2f00606296d6c815c50569146cdd2ac5c80e5b02
  switch(JoystickDirection)
      {
        case "r":
          port.write(PelcoDRight)
          break;
        case "ur":
          port.write(PelcoDUpRight)
          break;
        case "u":
          port.write(PelcoDUp)
          break;
        case "ul":
          port.write(PelcoDUpLeft)
          break;
        case "l":
          port.write(PelcoDLeft)
          break;
        case "dl":
          port.write(PelcoDDownLeft)
          break;
        case "d":
          port.write(PelcoDDown)
          break;
        case "dr":
          port.write(PelcoDDownRight)
          break;
        case "s":
          port.write(PelcoDStop)
          break;
      }
}


ipcMain.on('JoyAngle', (event, arg) => {
  //console.log(`JoyAngle Received reply from web page: ${arg}`);
  if(!isEmptyObject(port)){
    let currentdirection = ""
    if(arg<22.5 || arg > 337.5)
    { //console.log("Decided Right")
      currentdirection = "r"
    }else if(arg>=22.5 && arg < 67.5)
    {  //console.log("Decided Up Right")
      currentdirection = "ur"
    }else if(arg>=67.5 && arg < 112.5)
    {  //console.log("Decided Up")
      currentdirection = "u"
    }else if(arg>=112.5 && arg < 157.5)
    {  //console.log("Decided Up Left")
     currentdirection = "ul"
    }else if(arg>=157.5 && arg < 202.5)
    {  //console.log("Decided Left")
      currentdirection = "l"
    }else if(arg>=202.5 && arg < 247.5)
    {  //console.log("Decided Down Left")
      currentdirection = "dl"
    }else if(arg>=247.5 && arg < 292.5)
    {  //console.log("Decided Down")
      currentdirection = "d"
    }else if(arg>=292.5 && arg <= 337.5)
    {  //console.log("Decided Down Right")
      currentdirection = "dr"
    }
    if(currentdirection != JoystickDirection){
     
      JoystickDirection = currentdirection;
      SendJoystickDirectionCommand(JoystickDirection) 
    }
  } 
});

ipcMain.on('JoyForce', (event, arg) => {
  //console.log(`JoyForce Received reply from web page: ${arg}`);
});

ipcMain.on('JoyDirection', (event, arg) => {
  //console.log(`JoyDirection Received reply from web page: ${arg}`);
});

//**********************************************/


ipcMain.on('SearchComportsAndHWJoysticks', (event, arg) => {
  console.log(`SearchComportsAndHWJoysticks Received ${arg}`);
  SerialPort.list().then(ports => {
    win.webContents.send('ComPortList',ports)    
  });
  totalJoyDevices = usb.findByIds(1973, 790)
  if(totalJoyDevices)
    win.webContents.send('HWJoystickList',totalJoyDevices.portNumbers)    

 });  

 var port = {}
 var portAliveSender;
  
 let comPortAliveMessage = new Uint8Array([0xFF,0x01,0x00,0xEF,0x10,0x0B,0x0B]);

 //Open Selected Serial Port and return State to HTML begin
 ipcMain.on('ComportSelectCommand', (event, arg) => {
  console.log(`ComportSelectCommand Received reply from web page: ${arg}`);
  port = new SerialPort(arg, {
    baudRate: 9600
  })
  port.write(comPortAliveMessage, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    win.webContents.send('ComportSelectState',arg)  
    portAliveSender = setInterval(sendComPortAliveMsg, 1000);  
    console.log('message written')
  })
 }); 
//Open Selected Serial Port and return State to HTML end





let device = {}
let myInterface;
let myEndpoint;

function ConnectToUSBJoystickAndListen(busNumber){
  console.log("totalJoyDevices" , totalJoyDevices);
  if(totalJoyDevices.portNumbers.includes(busNumber)){
    device = totalJoyDevices
    device.open();
    myInterface = device.interface(0);
    myEndpoint = myInterface.endpoints[0];
    myInterface.claim();
    win.webContents.send('JoystickSelectState',busNumber)  

    myEndpoint.startPoll(1, 8);
    myEndpoint.on('data', function (data) {
      //console.log(data)
      ConvertAndSendCommandsFromJoystick(data);
    });
    myEndpoint.on('error', function (error) {
      console.log("on error", error);
    });
  }
}

 //Open Selected Joystick and return State to HTML begin
 ipcMain.on('JoystickSelectCommand', (event, arg) => {
  console.log(`JoystickSelectCommand Received reply from web page: ${arg}`);
  ConnectToUSBJoystickAndListen(parseInt(arg,10))
 }); 
//Open Selected Joystick and return State to HTML end






 function sendComPortAliveMsg() {
  console.log("It's me ... periodic alive msg sender")
  port.write(comPortAliveMessage);
}


// This should work in node.js and other ES5 compliant implementations.
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}


function ConvertAndSendCommandsFromJoystick(data){
  let createdByteArray = new Uint8Array([0,1,2,3,4,5,6,7]);
  let axisX = uncomplement(data[0],8);
  let axisY = uncomplement(data[1],8);
  let currentJoystickDirection = ""

  if((Math.abs(axisX) > 10 || Math.abs(axisY) > 10)
      || (Math.abs(axisX) < 10 && Math.abs(axisY) < 10)){
    let angle = radians_to_degrees(Math.atan2(axisX, axisY))+180
    //console.log("X Axis: ",axisX,"Y Axis: ",axisY, "Angle : ",angle)
    
    if(!isEmptyObject(port)){
      if(Math.abs(axisX) < 10 && Math.abs(axisY) < 10){
        currentJoystickDirection = "s";
      }else if(angle<292.5 && angle > 247.5)
      { //console.log("Decided Right")
        currentJoystickDirection = "r";
      }else if(angle>=292.5 && angle < 337.5)
      {  //console.log("Decided Up Right")
        currentJoystickDirection = "ur";
      }else if(angle>=337.5 || angle < 22.5)
      {  //console.log("Decided Up")
        currentJoystickDirection = "u";
      }else if(angle>=22.5 && angle < 67.5)
      {  //console.log("Decided Up Left")
        currentJoystickDirection = "ul";
      }else if(angle>=67.5 && angle < 112.5)
      {  //console.log("Decided Left")
        currentJoystickDirection = "l";
      }else if(angle>=112.5 && angle < 157.5)
      {  //console.log("Decided Down Left")
        currentJoystickDirection = "dl";
      }else if(angle>=157.5 && angle < 202.5)
      {  //console.log("Decided Down")
        currentJoystickDirection = "d";
      }else if(angle>=202.5 && angle <= 247.5)
      {  //console.log("Decided Down Right")
        currentJoystickDirection = "dr";
      }

      if(currentJoystickDirection != JoystickDirection){
        JoystickDirection = currentJoystickDirection
        SendJoystickDirectionCommand(JoystickDirection) 
      }
    }
  }
}

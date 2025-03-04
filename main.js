const { app, ipcMain, BrowserWindow, dialog } = require("electron");
const path = require('path')
const {Auth} = require('msmc')
const fs = require('fs-extra')
const axios = require('axios')
const os = require('os')
let mainWindow;
let authData = null
const authFilePath = path.join(app.getPath('userData'), 'authData.json');


function createMainWindow(file) {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        icon: path.join(__dirname, 'assets', 'logo.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    mainWindow.loadFile(path.join(__dirname, file));

    mainWindow.on("closed", () => (mainWindow = null));
}
// Espera a que la app esté lista
app.whenReady().then(() => {
    createMainWindow('loading.html');

    setTimeout(() => {
        mainWindow.loadFile(path.join(__dirname, 'login.html'));
    }, 3000);

});


//AUTENTICACION
async function autenticarSiNecesario() {
    if(authData && !hasTokenExpired(authData)){
        return authData
    }

    try{
        const authManager = new Auth('select_account')
        const xboxManager = await authManager.launch('electron', {width:800, height:600})
        authData = await xboxManager.getMinecraft()
        authData.timestamp = Date.now()
        await saveAuthData(authData)
        console.log(authData)
        return authData
    }catch(e){
        console.error(e)
    }
}

async function saveAuthData(data) {
    await fs.writeFile(authFilePath, JSON.stringify(data, null, 2));
}

async function loadAuthData() {
    if (await fs.pathExists(authFilePath)) {
        const data = await fs.readJson(authFilePath);
        if (!hasTokenExpired(data.timestamp)) {
            authData = data;
            return true;
        }
    }
    return false;
}
function hasTokenExpired(timestamp) {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp > oneWeek;
}
ipcMain.on("loadAppHtml", (event) => {
    mainWindow.loadFile(path.join(__dirname, "app.html")).catch((error) => {
        console.error("Error al cargar app.html:", error);
        event.sender.send("err", "No se pudo cargar la interfaz principal.");
    });
});
ipcMain.on("login", async (event) => {
    try {
        const authManager = new Auth("select_account");
        const xboxManager = await authManager.launch("electron", { width: 800, height: 600 });
        const authData = await xboxManager.getMinecraft();
        
        event.sender.send("authToken", authData);
        await saveAuthData(authData);
    } catch (error) {
        console.error("Error en autenticación:", error.message);
        event.sender.send("err", "Error en autenticación. Intente nuevamente.");
    }
});
ipcMain.on("logout", (event) => {
    authData = null;
    fs.removeSync(authFilePath);
    
    event.sender.send("loggedOut");

    mainWindow.loadFile(path.join(__dirname, "login.html")).catch((error) => {
        console.error("Error al cargar index.html:", error);
    });
});

const ipc = require("electron").ipcRenderer;
const logoutBtn = document.getElementById("logout");
const { ipcRenderer } = require('electron'); 

logoutBtn.addEventListener('click', () => {
    ipc.send('logout');
});
ipcRenderer.on("loggedOut", () => {
    localStorage.removeItem("authToken");
    snack("Sesión cerrada correctamente.");
});
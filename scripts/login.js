// index.js

const ipc = require("electron").ipcRenderer;
const loginBtn = document.getElementById("loginbtn");
const pirateBtn = document.getElementById('piratebtn')
document.addEventListener('DOMContentLoaded', () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        ipc.send("loadAppHtml");
    }
});

loginBtn.addEventListener('click', () => {
    loginBtn.disabled = true;
    pirateBtn.disabled = true;
    loginBtn.innerHTML = '<div class="spinner"></div>';
    loginBtn.style.width = '60px';
    loginBtn.style.height = '60px';
    loginBtn.style.borderRadius = '50px';
    ipc.send("login");
});

// Recibe errores de login
ipc.on("err", (evt, message) => {
    snack(message);
    loginBtn.disabled = false;
    pirateBtn.disabled =false;
    loginBtn.innerHTML = '<i class="fa-brands fa-xbox"></i> Iniciar Sesión';
    loginBtn.style.width = '17.625rem';
    loginBtn.style.height = '3.8rem';
    loginBtn.style.borderRadius = '13px';
});

ipc.on("authToken", (evt, token) => {
    localStorage.setItem('authToken', JSON.stringify(token));
    ipc.send("loadAppHtml");
});

function snack(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.classList.add("show");
    setTimeout(() => snackbar.classList.remove("show"), 3000);
}

const dashboardSection = document.getElementById('dashboardSection')
const instanceSection = document.getElementById('createSectionInstance')
const configSection = document.getElementById('configSection')
const botonDashboard = document.getElementById('botonDashboard')
const botonInstance = document.getElementById('botonInstance')
const botonConfig = document.getElementById('botonConfig')
let authToken = JSON.parse(localStorage.getItem('authToken'));

botonDashboard.addEventListener('click', () => {
    botonDashboard.classList.add('selected');
    botonInstance.classList.remove('selected');
    botonConfig.classList.remove('selected');
    dashboardSection.classList.add('active');
    instanceSection.classList.remove('active');
    configSection.classList.remove('active');
})
botonInstance.addEventListener('click', () => {
    botonDashboard.classList.remove('selected');
    botonInstance.classList.add('selected');
    botonConfig.classList.remove('selected');
    dashboardSection.classList.remove('active');
    instanceSection.classList.add('active');
    configSection.classList.remove('active');
})
botonConfig.addEventListener('click', () => {
    botonDashboard.classList.remove('selected');
    botonInstance.classList.remove('selected');
    botonConfig.classList.add('selected');
    dashboardSection.classList.remove('active');
    instanceSection.classList.remove('active');
    configSection.classList.add('active');
})

document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        document.getElementById('userPhoto').src = `https://minotar.net/avatar/${authToken.profile.name}/100.png`;
        document.getElementById('userName').textContent = authToken.profile.name;
    }
    loadSettings();  // Cargar configuraciones guardadas
    updateClock();
    fetchNews();
});

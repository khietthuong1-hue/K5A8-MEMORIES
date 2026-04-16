const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    // Tạo cửa sổ trình duyệt
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'logo.png'), // Icon ứng dụng
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Cho phép chạy script thoải mái
        },
        autoHideMenuBar: true // Ẩn thanh menu File/Edit thừa thãi
    });

    // Tải trang chủ (chuachieng.html)
    mainWindow.loadFile('index.html');

    // Mở toang màn hình khi chạy (Tùy chọn)
    // mainWindow.maximize();
}

// Khi ứng dụng sẵn sàng thì tạo cửa sổ
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Thoát ứng dụng khi đóng tất cả cửa sổ
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
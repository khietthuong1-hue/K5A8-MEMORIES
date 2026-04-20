// === auth-guard.js ===
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBKUkvFuSBZcCQlVnuey56u7UukG1wM3Ig",
    authDomain: "k5a8-fe4d3.firebaseapp.com",
    databaseURL: "https://k5a8-fe4d3-default-rtdb.firebaseio.com",
    projectId: "k5a8-fe4d3",
    messagingSenderId: "488022889850",
    appId: "1:488022889850:web:3aaca9ec88f339fce0f2c3"
};

// Khởi tạo Firebase (Kiểm tra nếu chưa khởi tạo thì mới chạy để tránh lỗi trùng lặp)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP TOÀN CỤC
onAuthStateChanged(auth, (user) => {
    // Tìm các thành phần UI trên trang hiện tại
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameDisplay = document.getElementById('user-name-display');
    const topAuthStatus = document.getElementById('auth-status'); // Dành cho trang Shorts

    if (user) {
        // ĐÃ ĐĂNG NHẬP
        window.currentUser = user; // Lưu biến toàn cục để các chức năng Tim/Comment sử dụng
        const shortName = user.displayName.split(' ')[0];

        // Cập nhật UI thanh Menu chung (index, news, humans, thanhtich)
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userNameDisplay) {
            userNameDisplay.style.display = 'inline-block';
            userNameDisplay.innerText = `Chào, ${shortName}`;
        }

        // Cập nhật UI riêng cho trang Shorts
        if (topAuthStatus) {
            topAuthStatus.innerHTML = `<i class="fas fa-user"></i> ${shortName}`;
            topAuthStatus.style.background = 'var(--primary)';
            topAuthStatus.style.borderColor = 'var(--primary)';
        }

        // Kích hoạt load lại nút Tim (nếu có hàm này trên trang)
        if (typeof window.initAllLikes === "function") window.initAllLikes();

    } else {
        // CHƯA ĐĂNG NHẬP
        window.currentUser = null;

        // Cập nhật UI thanh Menu chung
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userNameDisplay) userNameDisplay.style.display = 'none';

        // Cập nhật UI trang Shorts
        if (topAuthStatus) {
            topAuthStatus.innerHTML = `<i class="fab fa-google"></i> Đăng nhập`;
            topAuthStatus.style.background = 'rgba(0,0,0,0.5)';
            topAuthStatus.style.borderColor = '#333';
        }
        
        // Kích hoạt load lại nút Tim (nếu có hàm này trên trang)
        if (typeof window.initAllLikes === "function") window.initAllLikes();
    }
});

// HÀM ĐĂNG NHẬP & ĐĂNG XUẤT DÙNG CHUNG CHO MỌI TRANG
window.globalLogin = () => {
    signInWithPopup(auth, provider).then(() => {
        if(typeof window.showToast === "function") window.showToast("Đăng nhập thành công!");
    }).catch(err => alert("Lỗi đăng nhập: " + err.message));
};

window.globalLogout = () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất khỏi K5A8?")) {
        signOut(auth).then(() => {
            if(typeof window.showToast === "function") window.showToast("Đã đăng xuất!");
            // Nếu đang ở trang yêu cầu đăng nhập, có thể đá văng về trang chủ:
            // window.location.href = "index.html"; 
        });
    }
};
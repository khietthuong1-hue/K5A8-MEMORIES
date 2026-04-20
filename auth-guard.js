// === auth-guard.js ===
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// Chuyển sang dùng signInWithRedirect để chống lỗi chặn Popup trên điện thoại
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKUkvFuSBZcCQlVnuey56u7UukG1wM3Ig",
    authDomain: "k5a8-fe4d3.firebaseapp.com",
    databaseURL: "https://k5a8-fe4d3-default-rtdb.firebaseio.com",
    projectId: "k5a8-fe4d3",
    messagingSenderId: "488022889850",
    appId: "1:488022889850:web:3aaca9ec88f339fce0f2c3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// HÀM HIỂN THỊ TOAST TOÀN CỤC
window.showToast = (msg, type = 'success') => {
    let toast = document.getElementById('toast');
    if (!toast) {
        // Tự động tạo thẻ Toast nếu trang nào đó quên chèn HTML
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    if (type === 'error') {
        toast.style.borderColor = '#ff4757';
        toast.innerHTML = `<i class="fas fa-exclamation-circle" style="color:#ff4757"></i> <span id="toast-msg">${msg}</span>`;
    } else {
        toast.style.borderColor = '#00BFFF';
        toast.innerHTML = `<i class="fas fa-check-circle" style="color:#00BFFF"></i> <span id="toast-msg">${msg}</span>`;
    }
    
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// LẮNG NGHE TRẠNG THÁI ĐĂNG NHẬP
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileArea = document.getElementById('user-profile-area');
    const avatarImg = document.getElementById('user-avatar');
    const nameDisplay = document.getElementById('user-name-display');
    const topAuthStatus = document.getElementById('auth-status'); // Cho trang Shorts

    if (user) {
        window.currentUser = user;
        const shortName = user.displayName.split(' ')[0];
        const photo = user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        // Giao diện chung (index, news, humans...)
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (profileArea) {
            profileArea.style.display = 'flex';
            if(avatarImg) avatarImg.src = photo;
            if(nameDisplay) nameDisplay.innerText = shortName;
        }

        // Giao diện trang Shorts
        if (topAuthStatus) {
            topAuthStatus.innerHTML = `<img src="${photo}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;"> ${shortName}`;
            topAuthStatus.style.background = 'var(--primary)';
            topAuthStatus.style.borderColor = 'var(--primary)';
        }

        // Kích hoạt load lại nút Tim (nếu có)
        if (typeof window.initAllLikes === "function") window.initAllLikes();

    } else {
        window.currentUser = null;

        // Giao diện chung
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (profileArea) profileArea.style.display = 'none';

        // Giao diện trang Shorts
        if (topAuthStatus) {
            topAuthStatus.innerHTML = `<i class="fab fa-google"></i> Đăng nhập`;
            topAuthStatus.style.background = 'rgba(0,0,0,0.5)';
            topAuthStatus.style.borderColor = '#333';
        }
        
        if (typeof window.initAllLikes === "function") window.initAllLikes();
    }
});

// HÀM ĐĂNG NHẬP/ĐĂNG XUẤT
window.globalLogin = () => {
    // Để khắc phục triệt để lỗi điện thoại, dùng try/catch kết hợp
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Điện thoại thường chặn popup, dùng Redirect sẽ an toàn 100%
        signInWithRedirect(auth, provider);
    } else {
        // Máy tính dùng Popup cho tiện
        signInWithPopup(auth, provider).then(() => {
            window.showToast("Đăng nhập thành công!");
        }).catch(err => {
            if (err.code !== 'auth/popup-closed-by-user') {
                window.showToast("Lỗi đăng nhập: " + err.message, 'error');
            }
        });
    }
};

window.globalLogout = () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất khỏi K5A8?")) {
        signOut(auth).then(() => {
            window.showToast("Đã đăng xuất tài khoản!");
        });
    }
};
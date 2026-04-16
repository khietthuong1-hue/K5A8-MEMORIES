import * as THREE from 'three';

// --- Thiết lập cơ bản ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Tạo các lớp của Vòng Tròn ---
const textureLoader = new THREE.TextureLoader();

// Lưu ý: Bạn cần thay URL này bằng ảnh vòng tròn ma thuật của bạn
const circleTexture = textureLoader.load('https://path-to-your-magic-circle-texture.png');

function createShieldLayer(radius, rotationSpeed, texture) {
    const geometry = new THREE.PlaneGeometry(radius, radius);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending, // Giúp hiệu ứng phát sáng
        side: THREE.DoubleSide,
        depthWrite: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    return { mesh, rotationSpeed };
}

// Tạo 3 lớp với kích thước khác nhau
const layers = [
    createShieldLayer(5, 0.005, circleTexture),
    createShieldLayer(4.5, -0.01, circleTexture), // Quay ngược lại
    createShieldLayer(3, 0.02, circleTexture)
];

const shieldGroup = new THREE.Group();
layers.forEach(layer => shieldGroup.add(layer.mesh));
scene.add(shieldGroup);

camera.position.z = 8;

// --- Tương tác Chuột ---
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    // Chuẩn hóa tọa độ chuột từ -1 đến 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- Vòng lặp Animation ---
function animate() {
    requestAnimationFrame(animate);

    // Xoay từng lớp theo tốc độ riêng
    layers.forEach(layer => {
        layer.mesh.rotation.z += layer.rotationSpeed;
    });

    // Tương tác: Nhóm vòng tròn nghiêng theo chuột
    shieldGroup.rotation.y = THREE.MathUtils.lerp(shieldGroup.rotation.y, mouseX * 0.5, 0.1);
    shieldGroup.rotation.x = THREE.MathUtils.lerp(shieldGroup.rotation.x, mouseY * -0.5, 0.1);

    renderer.render(scene, camera);
}

animate();

// Resize window
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
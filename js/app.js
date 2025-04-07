// DOM要素の取得
const homeLink = document.getElementById('home-link');
const rotationLink = document.getElementById('rotation-link');
const rollingLink = document.getElementById('rolling-link');
const aboutLink = document.getElementById('about-link');

const homeSection = document.getElementById('home-section');
const rotationSection = document.getElementById('rotation-section');
const rollingSection = document.getElementById('rolling-section');
const aboutSection = document.getElementById('about-section');

const startRotationBtn = document.getElementById('start-rotation');
const startRollingBtn = document.getElementById('start-rolling');

const rotationCanvas = document.getElementById('rotation-canvas');
const rollingCanvas = document.getElementById('rolling-canvas');

const rotationAngle = document.getElementById('rotation-angle');
const angleValue = document.getElementById('angle-value');
const rotationSpeed = document.getElementById('rotation-speed');
const resetRotationBtn = document.getElementById('reset-rotation');

const rollingDistance = document.getElementById('rolling-distance');
const distanceValue = document.getElementById('distance-value');
const rollingSpeed = document.getElementById('rolling-speed');
const resetRollingBtn = document.getElementById('reset-rolling');

// キャンバスの設定
const rotationCtx = rotationCanvas.getContext('2d');
const rollingCtx = rollingCanvas.getContext('2d');

// キャンバスのサイズ設定
function resizeCanvas(canvas) {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// 初期化時にキャンバスサイズを設定
window.addEventListener('load', () => {
    resizeCanvas(rotationCanvas);
    resizeCanvas(rollingCanvas);
});

// ウィンドウリサイズ時にキャンバスサイズを再設定
window.addEventListener('resize', () => {
    resizeCanvas(rotationCanvas);
    resizeCanvas(rollingCanvas);
    drawRotationShape();
    drawRollingShape();
});

// ナビゲーション
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(homeSection);
});

rotationLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(rotationSection);
});

rollingLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(rollingSection);
});

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(aboutSection);
});

// セクション表示関数
function showSection(section) {
    // すべてのセクションを非表示
    homeSection.classList.remove('active-section');
    homeSection.classList.add('hidden-section');
    rotationSection.classList.remove('active-section');
    rotationSection.classList.add('hidden-section');
    rollingSection.classList.remove('active-section');
    rollingSection.classList.add('hidden-section');
    aboutSection.classList.remove('active-section');
    aboutSection.classList.add('hidden-section');
    
    // 指定されたセクションを表示
    section.classList.remove('hidden-section');
    section.classList.add('active-section');
}

// ホーム画面のボタン
startRotationBtn.addEventListener('click', () => {
    showSection(rotationSection);
});

startRollingBtn.addEventListener('click', () => {
    showSection(rollingSection);
});

// 回転シミュレータ
let rotationShape = {
    type: 'triangle',
    vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 86.6 }
    ],
    center: { x: 50, y: 28.87 }
};

function drawRotationShape() {
    // キャンバスをクリア
    rotationCtx.clearRect(0, 0, rotationCanvas.width, rotationCanvas.height);
    
    // 座標系を中央に移動
    rotationCtx.save();
    rotationCtx.translate(rotationCanvas.width / 2, rotationCanvas.height / 2);
    
    // 回転角度を取得
    const angle = parseFloat(rotationAngle.value);
    
    // 回転前の図形を描画（薄い色）
    rotationCtx.beginPath();
    rotationCtx.moveTo(rotationShape.vertices[0].x - rotationShape.center.x, rotationShape.vertices[0].y - rotationShape.center.y);
    for (let i = 1; i < rotationShape.vertices.length; i++) {
        rotationCtx.lineTo(rotationShape.vertices[i].x - rotationShape.center.x, rotationShape.vertices[i].y - rotationShape.center.y);
    }
    rotationCtx.closePath();
    rotationCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    rotationCtx.stroke();
    
    // 回転後の図形を描画
    rotationCtx.beginPath();
    for (let i = 0; i < rotationShape.vertices.length; i++) {
        const x = rotationShape.vertices[i].x - rotationShape.center.x;
        const y = rotationShape.vertices[i].y - rotationShape.center.y;
        
        // 回転行列を適用
        const rad = angle * Math.PI / 180;
        const rotatedX = x * Math.cos(rad) - y * Math.sin(rad);
        const rotatedY = x * Math.sin(rad) + y * Math.cos(rad);
        
        if (i === 0) {
            rotationCtx.moveTo(rotatedX, rotatedY);
        } else {
            rotationCtx.lineTo(rotatedX, rotatedY);
        }
    }
    rotationCtx.closePath();
    rotationCtx.fillStyle = 'rgba(74, 111, 165, 0.3)';
    rotationCtx.fill();
    rotationCtx.strokeStyle = '#4a6fa5';
    rotationCtx.stroke();
    
    // 回転の中心を描画
    rotationCtx.beginPath();
    rotationCtx.arc(0, 0, 5, 0, Math.PI * 2);
    rotationCtx.fillStyle = '#4a6fa5';
    rotationCtx.fill();
    
    // 角度を表示
    rotationCtx.font = '16px Arial';
    rotationCtx.fillStyle = '#333';
    rotationCtx.textAlign = 'center';
    rotationCtx.fillText(`${angle}°`, 0, -20);
    
    rotationCtx.restore();
}

// 回転角度の変更
rotationAngle.addEventListener('input', () => {
    angleValue.textContent = rotationAngle.value;
    drawRotationShape();
});

// 回転速度の変更
rotationSpeed.addEventListener('change', () => {
    // 速度に応じたアニメーション処理（実装予定）
});

// 回転リセット
resetRotationBtn.addEventListener('click', () => {
    rotationAngle.value = 0;
    angleValue.textContent = '0';
    drawRotationShape();
});

// 転がりシミュレータ
let rollingShape = {
    type: 'square',
    size: 50,
    position: 0
};

function drawRollingShape() {
    // キャンバスをクリア
    rollingCtx.clearRect(0, 0, rollingCanvas.width, rollingCanvas.height);
    
    // 座標系を設定
    rollingCtx.save();
    
    // 地面を描画
    rollingCtx.beginPath();
    rollingCtx.moveTo(50, rollingCanvas.height - 50);
    rollingCtx.lineTo(rollingCanvas.width - 50, rollingCanvas.height - 50);
    rollingCtx.strokeStyle = '#333';
    rollingCtx.lineWidth = 2;
    rollingCtx.stroke();
    
    // 移動距離を取得
    const distance = parseFloat(rollingDistance.value);
    
    // 正方形の位置を計算
    const x = 50 + distance;
    const y = rollingCanvas.height - 50 - rollingShape.size / 2;
    
    // 回転角度を計算（距離に基づく）
    const angle = (distance / (rollingShape.size * Math.PI / 2)) * 90;
    
    // 正方形を描画
    rollingCtx.translate(x, y);
    rollingCtx.rotate(angle * Math.PI / 180);
    
    rollingCtx.beginPath();
    rollingCtx.rect(-rollingShape.size / 2, -rollingShape.size / 2, rollingShape.size, rollingShape.size);
    rollingCtx.fillStyle = 'rgba(74, 111, 165, 0.3)';
    rollingCtx.fill();
    rollingCtx.strokeStyle = '#4a6fa5';
    rollingCtx.stroke();
    
    // 頂点をマーク
    rollingCtx.beginPath();
    rollingCtx.arc(-rollingShape.size / 2, -rollingShape.size / 2, 3, 0, Math.PI * 2);
    rollingCtx.fillStyle = '#4a6fa5';
    rollingCtx.fill();
    
    rollingCtx.restore();
    
    // 距離を表示
    rollingCtx.font = '16px Arial';
    rollingCtx.fillStyle = '#333';
    rollingCtx.textAlign = 'center';
    rollingCtx.fillText(`${distance}cm`, x, y - rollingShape.size);
}

// 移動距離の変更
rollingDistance.addEventListener('input', () => {
    distanceValue.textContent = rollingDistance.value;
    drawRollingShape();
});

// 転がり速度の変更
rollingSpeed.addEventListener('change', () => {
    // 速度に応じたアニメーション処理（実装予定）
});

// 転がりリセット
resetRollingBtn.addEventListener('click', () => {
    rollingDistance.value = 0;
    distanceValue.textContent = '0';
    drawRollingShape();
});

// 初期描画
drawRotationShape();
drawRollingShape(); 
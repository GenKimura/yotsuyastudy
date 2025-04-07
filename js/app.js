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

// 例題データ
const rotationProblems = [
    {
        id: 1,
        title: "例題1: 点を中心とした回転",
        description: "三角形ABCがあり、点Cを中心に75°回転させました。回転後の角A'CBの大きさを求めなさい。",
        shape: {
            type: 'triangle',
            vertices: [
                { x: 100, y: -50 },  // A
                { x: -100, y: -50 },   // B
                { x: 0, y: 50 }      // C (回転の中心)
            ],
            labels: ['A', 'B', 'C'],
            center: { x: 0, y: 50 }  // 点C
        },
        answer: 75,
        hint: "回転の中心を正確に特定し、回転角度と対応する点の位置関係を把握しましょう。",
        choices: ["60°", "75°", "90°", "120°"]
    }
];

// キャンバスのサイズ設定
function resizeCanvas(canvas) {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}

// 初期化時にキャンバスサイズを設定
window.addEventListener('load', () => {
    resizeCanvas(rotationCanvas);
    resizeCanvas(rollingCanvas);
    drawRotationShape();
    drawRollingShape();
});

// ウィンドウリサイズ時にキャンバスサイズを再設定
window.addEventListener('resize', () => {
    resizeCanvas(rotationCanvas);
    resizeCanvas(rollingCanvas);
    drawRotationShape();
    drawRollingShape();
});

// ナビゲーション
function showSection(section) {
    [homeSection, rotationSection, rollingSection, aboutSection].forEach(s => {
        s.classList.remove('active-section');
        s.classList.add('hidden-section');
    });
    section.classList.remove('hidden-section');
    section.classList.add('active-section');
}

[
    [homeLink, homeSection],
    [rotationLink, rotationSection],
    [rollingLink, rollingSection],
    [aboutLink, aboutSection]
].forEach(([link, section]) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(section);
    });
});

// ホーム画面のボタン
startRotationBtn.addEventListener('click', () => {
    showSection(rotationSection);
});

startRollingBtn.addEventListener('click', () => {
    showSection(rollingSection);
});

// 回転シミュレータ
let currentProblem = rotationProblems[0];
let isAnimating = false;
let animationId = null;
let currentRotationAngle = 0;
let paths = {
    A: [],
    B: []
};

function drawRotationShape() {
    const canvas = rotationCanvas;
    const ctx = rotationCtx;
    const scale = Math.min(canvas.width, canvas.height) / 400;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 座標系を中央に移動
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    // グリッドを描画
    drawGrid(ctx, canvas.width / scale, canvas.height / scale);
    
    // 回転角度を取得
    const angle = isAnimating ? currentRotationAngle : parseFloat(rotationAngle.value);
    
    // 回転前の図形を描画（薄い色）
    drawShape(ctx, currentProblem.shape, 'rgba(0, 0, 255, 0.2)', true);
    
    // 軌跡を描画
    if (paths.A.length > 0) {
        drawPath(ctx, paths.A, 'rgba(255, 0, 0, 0.5)');
    }
    if (paths.B.length > 0) {
        drawPath(ctx, paths.B, 'rgba(0, 255, 0, 0.5)');
    }
    
    // 回転後の図形を描画
    drawRotatedShape(ctx, currentProblem.shape, angle);
    
    // 回転の中心を描画
    drawRotationCenter(ctx, currentProblem.shape.center);
    
    // 角度を表示
    drawAngleLabel(ctx, angle);

    ctx.restore();
}

function drawGrid(ctx, width, height) {
    const gridSize = 20;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;

    // 垂直線
    for (let x = -width/2; x < width/2; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -height/2);
        ctx.lineTo(x, height/2);
        ctx.stroke();
    }

    // 水平線
    for (let y = -height/2; y < height/2; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-width/2, y);
        ctx.lineTo(width/2, y);
        ctx.stroke();
    }

    // 座標軸
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.lineTo(width/2, 0);
    ctx.moveTo(0, -height/2);
    ctx.lineTo(0, height/2);
    ctx.stroke();
}

function drawPath(ctx, path, color) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawShape(ctx, shape, color, showLabels = true) {
    ctx.beginPath();
    ctx.moveTo(shape.vertices[0].x, shape.vertices[0].y);
    for (let i = 1; i < shape.vertices.length; i++) {
        ctx.lineTo(shape.vertices[i].x, shape.vertices[i].y);
    }
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (showLabels) {
        // 頂点のラベルを描画
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        shape.vertices.forEach((vertex, i) => {
            ctx.fillText(shape.labels[i], vertex.x + 10, vertex.y + 10);
        });
    }
}

function drawRotatedShape(ctx, shape, angle) {
    const rad = angle * Math.PI / 180;
    const center = shape.center;
    
    const rotatedVertices = shape.vertices.map(vertex => {
        const dx = vertex.x - center.x;
        const dy = vertex.y - center.y;
        return {
            x: center.x + dx * Math.cos(rad) - dy * Math.sin(rad),
            y: center.y + dx * Math.sin(rad) + dy * Math.cos(rad)
        };
    });

    // 軌跡を記録
    if (isAnimating) {
        paths.A.push(rotatedVertices[0]);
        paths.B.push(rotatedVertices[1]);
    }

    ctx.beginPath();
    ctx.moveTo(rotatedVertices[0].x, rotatedVertices[0].y);
    for (let i = 1; i < rotatedVertices.length; i++) {
        ctx.lineTo(rotatedVertices[i].x, rotatedVertices[i].y);
    }
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 回転後の頂点のラベルを描画
    ctx.font = '16px Arial';
    ctx.fillStyle = '#f00';
    rotatedVertices.forEach((vertex, i) => {
        const label = shape.labels[i];
        ctx.fillText(label + "'", vertex.x + 10, vertex.y + 10);
    });
}

function drawRotationCenter(ctx, center) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#4a6fa5';
    ctx.fill();
}

function drawAngleLabel(ctx, angle) {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(`${angle}°`, 0, -160);
}

function startAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    paths = { A: [], B: [] };
    currentRotationAngle = 0;
    
    function animate() {
        if (currentRotationAngle >= 75) {
            isAnimating = false;
            cancelAnimationFrame(animationId);
            return;
        }
        
        currentRotationAngle += 1;
        drawRotationShape();
        animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
}

// イベントリスナー
rotationAngle.addEventListener('input', () => {
    if (!isAnimating) {
        angleValue.textContent = rotationAngle.value;
        drawRotationShape();
    }
});

resetRotationBtn.addEventListener('click', () => {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    paths = { A: [], B: [] };
    currentRotationAngle = 0;
    rotationAngle.value = 0;
    angleValue.textContent = '0';
    drawRotationShape();
});

// 転がりシミュレータ（既存のコード）
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

rollingDistance.addEventListener('input', () => {
    distanceValue.textContent = rollingDistance.value;
    drawRollingShape();
});

resetRollingBtn.addEventListener('click', () => {
    rollingDistance.value = 0;
    distanceValue.textContent = '0';
    drawRollingShape();
});

// 初期描画
drawRotationShape();
drawRollingShape(); 
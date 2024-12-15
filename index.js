const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const TICK_INTERVAL = 1000;  // Game update interval in ms

let score = 0;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const shapes = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

let currentShape = generateShape();
let currentX = Math.floor(COLS / 2) - 1;
let currentY = 0;

// Fungsi untuk menggambar papan permainan
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        ctx.fillStyle = 'lime';
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Fungsi untuk menggambar bentuk saat ini
function drawShape() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        ctx.fillStyle = 'red';
        ctx.fillRect((currentX + col) * BLOCK_SIZE, (currentY + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// Fungsi untuk memeriksa tabrakan dengan papan atau batas
function collide() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        let x = currentX + col;
        let y = currentY + row;
        if (x < 0 || x >= COLS || y >= ROWS || board[y][x]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Fungsi untuk menempatkan bentuk pada papan setelah mencapai bawah
function placeShape() {
  for (let row = 0; row < currentShape.length; row++) {
    for (let col = 0; col < currentShape[row].length; col++) {
      if (currentShape[row][col]) {
        board[currentY + row][currentX + col] = 1;
      }
    }
  }
}

// Fungsi untuk menghapus garis yang terisi dan memperbarui skor
function clearLines() {
  let linesCleared = 0;
  
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell === 1)) {
      board.splice(row, 1);  // Menghapus garis yang terisi
      board.unshift(Array(COLS).fill(0));  // Menambahkan garis kosong di bagian atas
      linesCleared++;
      score += 100;  // Menambah skor sebanyak 100 untuk setiap garis yang dihapus
    }
  }

  // Tambahkan bonus untuk beberapa garis yang dihapus sekaligus
  if (linesCleared > 1) {
    score += linesCleared * 50;  // Bonus 50 poin untuk setiap garis ekstra yang dihapus
  }
}

// Fungsi untuk menghasilkan bentuk baru secara acak
function generateShape() {
  return shapes[Math.floor(Math.random() * shapes.length)];
}

// Fungsi untuk memperbarui tampilan skor
function updateScoreDisplay() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Fungsi untuk memperbarui permainan
function update() {
  currentY++;
  
  if (collide()) {
    currentY--;  // Kembali ke posisi semula jika tabrakan terdeteksi
    placeShape();
    clearLines();  // Menghapus garis yang terisi
    currentShape = generateShape();  // Membuat bentuk baru
    currentX = Math.floor(COLS / 2) - 1;
    currentY = 0;
    
    if (collide()) {
      alert('Game Over');
      board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      score = 0;  // Reset skor jika permainan selesai
    }
  }

  drawBoard();
  drawShape();
  updateScoreDisplay();  // Memperbarui tampilan skor
}

function moveLeft() {
  currentX--;
  if (collide()) {
    currentX++;
  }
  drawBoard();
  drawShape();
}

function moveRight() {
  currentX++;
  if (collide()) {
    currentX--;
  }
  drawBoard();
  drawShape();
}

function rotateShape() {
  const rotatedShape = currentShape[0].map((_, index) =>
    currentShape.map(row => row[index])
  ).reverse();
  
  const originalShape = currentShape;
  currentShape = rotatedShape;
  if (collide()) {
    currentShape = originalShape;
  }
  drawBoard();
  drawShape();
}

function drop() {
  update();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') moveLeft();
  if (e.key === 'ArrowRight') moveRight();
  if (e.key === 'ArrowDown') drop();
  if (e.key === 'ArrowUp') rotateShape();
});

setInterval(update, TICK_INTERVAL);

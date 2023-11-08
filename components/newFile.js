export default (await import('vue')).defineComponent({
name: 'OthelloBoard',
components: {
OthelloCell,
},
data() {
const cells = Array(64).fill(null); // 8x8 board

// 中央の4マスに初期石を配置
const middle = 8 / 2;
cells[middle * 8 + middle - 1] = 'white';
cells[middle * 8 + middle] = 'black';
cells[(middle - 1) * 8 + middle - 1] = 'black';
cells[(middle - 1) * 8 + middle] = 'white';
return {
cells,
currentPlayer: 'black',
isPass: false, // パスが必要かどうかのフラグ
};
},
isWhiteWinner() {
return this.whiteScore > this.blackScore;
},
isBlackWinner() {
return this.blackScore > this.whiteScore;
},
methods: {
placeStone(index) {
// クリックされたセルが空でなければ何もしない
if (this.cells[index] !== null) return;

// 有効な手かどうかをチェックする
if (!this.isValidMove(index, this.currentPlayer)) return;

// 石を置く
this.cells[index] = this.currentPlayer;

// 石をひっくり返す
this.flipStones(index);

// 次のプレイヤーに交代する
this.switchPlayer();
},
switchPlayer() {
// プレイヤーを交代する
this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

// 次のプレイヤーが手を打てるかどうかをチェックする
if (!this.canPlayerMakeMove(this.currentPlayer)) {
this.isPass = true; // パスが必要な場合はフラグを立てる
setTimeout(() => {
this.isPass = false; // 一定時間後にオーバーレイを非表示にする
this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
}, 2000); // 2秒後にオーバーレイを非表示にする
}
},
canPlayerMakeMove(player) {
return this.cells.some((cell, index) => cell === null && this.isValidMove(index, player));
},
isValidMove(index, player) {
const opponent = player === 'black' ? 'white' : 'black';
let isValid = false;

const directions = [
-1,
1,
-8,
8,
-7,
-9,
7,
9, // 左下
];

for (let direction of directions) {
let i = index + direction;
let tilesToFlip = [];

while (i >= 0 && i < 64 && this.isAdjacent(i, i - direction, direction)) {
if (this.cells[i] === opponent) {
tilesToFlip.push(i);
i += direction;
} else if (this.cells[i] === player) {
if (tilesToFlip.length > 0) {
// 相手の石を挟んでいる場合のみ有効
isValid = true;
break;
}
break;
} else {
// 空のセルが見つかった場合、その方向は無効
break;
}
}
}

return isValid;
},
flipStones(index) {
const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
const directions = [
-1,
1,
-8,
8,
-7,
-9,
7,
9, // 左下
];

directions.forEach((direction) => {
let tilesToFlip = [];
let i = index;
let tilesFlippable = false;

i += direction;
while (i >= 0 && i < 64 && this.isAdjacent(i, i - direction, direction)) {
if (this.cells[i] === opponent) {
tilesToFlip.push(i);
i += direction;
} else if (this.cells[i] === this.currentPlayer) {
tilesFlippable = true;
break;
} else {
break;
}
}

if (tilesFlippable) {
tilesToFlip.forEach((flipIndex) => {
this.cells[flipIndex] = this.currentPlayer;
});
}
});
},

isAdjacent(currentIndex, previousIndex, direction) {
// 同じ行にあるかどうかをチェック
if (direction === -1 || direction === 1) {
return Math.floor(currentIndex / 8) === Math.floor(previousIndex / 8);
}
// 同じ列にあるかどうかをチェック
if (direction === -8 || direction === 8) {
return true; // 上下移動は常に同じ列になる
}
// 斜めのチェック
if (direction === -7 || direction === 9) {
return (currentIndex % 8) > (previousIndex % 8);
}
if (direction === -9 || direction === 7) {
return (currentIndex % 8) < (previousIndex % 8);
}
return false;
},
checkGameOver() {
if (!this.canPlayerMakeMove('white') && !this.canPlayerMakeMove('black')) {
this.isGameOver = true;
this.calculateScores();
}
},
calculateScores() {
this.whiteScore = this.cells.filter(cell => cell === 'white').length;
this.blackScore = this.cells.filter(cell => cell === 'black').length;
},
},
computed: {
blackStonesCount() {
return this.cells.filter(cell => cell === 'black').length;
},
whiteStonesCount() {
return this.cells.filter(cell => cell === 'white').length;
}
},
});

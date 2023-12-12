<template>
    <AppHeader />

    <div class="game-container">
        <div class="current-player">
            Current Player:
            <img v-if="currentPlayer === 'black'" src="black.png" alt="Black Stone">
            <img v-if="currentPlayer === 'white'" src="white.png" alt="White Stone">
        </div>
        <div class="count black-count">
            <img src="black.png" alt="Black Stone" class="stone-image">
            <span>{{ blackStonesCount }}</span>
        </div>
        <div class="count white-count">
            <span>{{ whiteStonesCount }}</span>
            <img src="white.png" alt="White Stone" class="stone-image">
        </div>
        <div v-if="isPass" class="overlay">
            <span class="pass-text">パス</span>
        </div>
        <div v-if="isGameOver" class="overlay">
            <div class="game-over-text">
                <p>ゲーム終了</p>
                <p class="score-display">白: {{ whiteScore }} - 黒: {{ blackScore }}</p>
                <p :class="{ 'winner': isWhiteWinner }">白: <span v-if="isWhiteWinner">WIN</span><span v-else>LOSE</span>
                </p>
                <p :class="{ 'winner': isBlackWinner }">黒: <span v-if="isBlackWinner">WIN</span><span v-else>LOSE</span>
                </p>
            </div>
        </div>

        <div class="board">
            <OthelloCell v-for="(cell, index) in cells" :key="index" :cell="cell" @click="placeStone(index)" />
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
import OthelloCell from './OthelloCell.vue';

const size = 8;
const cells = ref(Array(size * size).fill(null));
const middle = size / 2;

cells.value[middle * size + middle - 1] = 'white';
cells.value[middle * size + middle] = 'black';
cells.value[(middle - 1) * size + middle - 1] = 'black';
cells.value[(middle - 1) * size + middle] = 'white';

const currentPlayer = ref('black');
const isPass = ref(false);
const isGameOver = ref(false);
const whiteScore = ref(0);
const blackScore = ref(0);

const isWhiteWinner = computed(() => whiteScore.value > blackScore.value);
const isBlackWinner = computed(() => blackScore.value > whiteScore.value);

const blackStonesCount = computed(() => cells.value.filter(cell => cell === 'black').length);
const whiteStonesCount = computed(() => cells.value.filter(cell => cell === 'white').length);

function placeStone(index) {
    if (cells.value[index] !== null) return;
    if (!isValidMove(index, currentPlayer.value)) return;
    cells.value[index] = currentPlayer.value;
    flipStones(index);
    switchPlayer();
}

function switchPlayer() {
    currentPlayer.value = currentPlayer.value === 'black' ? 'white' : 'black';

    if (!canPlayerMakeMove('white') && !canPlayerMakeMove('black')) {
        isGameOver.value = true;
        calculateScores();
    } else if (!canPlayerMakeMove(currentPlayer.value)) {
        isPass.value = true;
        setTimeout(() => {
            isPass.value = false;
            switchPlayer();
        }, 2000);
    }
}

function canPlayerMakeMove(player) {
    return cells.value.some((cell, index) => cell === null && isValidMove(index, player));
}

function isValidMove(index, player) {
    const opponent = player === 'black' ? 'white' : 'black';
    let isValid = false;

    const directions = [-1, 1, -8, 8, -7, -9, 7, 9];

    for (let direction of directions) {
        let i = index + direction;
        let tilesToFlip = [];

        while (i >= 0 && i < 64 && isAdjacent(i, i - direction, direction)) {
            if (cells.value[i] === opponent) {
                tilesToFlip.push(i);
                i += direction;
            } else if (cells.value[i] === player) {
                if (tilesToFlip.length > 0) {
                    isValid = true;
                    break;
                }
                break;
            } else {
                break;
            }
        }
    }

    return isValid;
}

function flipStones(index) {
    const opponent = currentPlayer.value === 'black' ? 'white' : 'black';
    const directions = [-1, 1, -8, 8, -7, -9, 7, 9];

    directions.forEach((direction) => {
        let tilesToFlip = [];
        let i = index + direction;
        let tilesFlippable = false;

        while (i >= 0 && i < 64 && isAdjacent(i, i - direction, direction)) {
            if (cells.value[i] === opponent) {
                tilesToFlip.push(i);
                i += direction;
            } else if (cells.value[i] === currentPlayer.value) {
                tilesFlippable = true;
                break;
            } else {
                break;
            }
        }

        if (tilesFlippable) {
            tilesToFlip.forEach((flipIndex) => {
                cells.value[flipIndex] = currentPlayer.value;
            });
        }
    });
}

function isAdjacent(currentIndex, previousIndex, direction) {
    if (direction === -1 || direction === 1) {
        return Math.floor(currentIndex / 8) === Math.floor(previousIndex / 8);
    }
    if (direction === -8 || direction === 8) {
        return true;
    }
    if (direction === -7 || direction === 9) {
        return (currentIndex % 8) > (previousIndex % 8);
    }
    if (direction === -9 || direction === 7) {
        return (currentIndex % 8) < (previousIndex % 8);
    }
    return false;
}

function calculateScores() {
    whiteScore.value = cells.value.filter(cell => cell === 'white').length;
    blackScore.value = cells.value.filter(cell => cell === 'black').length;
}
</script>
  
<style scoped>
.game-container {
    text-align: center;
}

.current-player {
    margin-bottom: 20px;
    font-size: 1.5em;
}

.current-player img {
    width: 50px;
    height: 50px;
    vertical-align: middle;
}

.board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    grid-gap: 5px;
    width: 80vmin;
    height: 80vmin;
    margin: 0 auto;
}

.scoreboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.stones-count img {
    width: 30px;
    height: 30px;
    vertical-align: middle;
}

.board-container {
    position: relative;
}

.count {
    position: absolute;
    display: flex;
    align-items: center;
}

.black-count {
    top:120px;
    left: 0;
}

.white-count {
    top: 110px;
    right: 0;
}

.stone-image {
    width: 80px;
    height: 80px;
    margin-right: 10px;
}

span {
    font-size: 80px;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.pass-text {
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 10px;
    font-size: 2em;
    color: #333;
}

.game-over-text {
    text-align: center;
    color: #fff;
}

.score-display {
    font-size: 1.5em;
    margin: 10px 0;
}

.winner {
    color: gold;
    font-weight: bold;
}


p:not(.winner) {
    color: black;
}

.game-container {
  /* 既存のスタイル */
  margin-top: 20px; /* 上部のマージンを追加 */
}

</style>
  
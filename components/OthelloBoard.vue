<template>
        <AppHeader />

        <div class="game-container">
            <div class="current-player">
                Current Player:
                <img v-if="currentPlayer === 'black'" src="../assets/black.png" alt="Black Stone">
                <img v-if="currentPlayer === 'white'" src="../assets/white.png" alt="White Stone">
            </div>
            <div class="count black-count">
                <img src="../assets/black.png" alt="Black Stone" class="stone-image">
                <span>{{ blackStonesCount }}</span>
            </div>
            <div class="count white-count">
                <span>{{ whiteStonesCount }}</span>
                <img src="../assets/white.png" alt="White Stone" class="stone-image">
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
  
<script>
import OthelloCell from './OthelloCell.vue';

export default {
    name: 'OthelloBoard',
    components: {
        OthelloCell,
    },
    data() {
        const size = 8;
        const cells = Array(size * size).fill(null);
        const middle = size / 2;

        cells[middle * size + middle - 1] = 'white';
        cells[middle * size + middle] = 'black';
        cells[(middle - 1) * size + middle - 1] = 'black';
        cells[(middle - 1) * size + middle] = 'white';

        return {
            cells,
            currentPlayer: 'black',
            isPass: false,
            isGameOver: false,
            whiteScore: 0,
            blackScore: 0,
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
            if (this.cells[index] !== null) return;
            if (!this.isValidMove(index, this.currentPlayer)) return;
            this.cells[index] = this.currentPlayer;
            this.flipStones(index);
            this.switchPlayer();
        },
        switchPlayer() {
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';

            if (!this.canPlayerMakeMove('white') && !this.canPlayerMakeMove('black')) {
                this.isGameOver = true;
                this.calculateScores();
            } else if (!this.canPlayerMakeMove(this.currentPlayer)) {
                this.isPass = true;
                setTimeout(() => {
                    this.isPass = false;
                    this.switchPlayer();
                }, 2000);
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
                9,
            ];

            for (let direction of directions) {
                let i = index + direction;
                let tilesToFlip = [];

                while (i >= 0 && i < 256 && this.isAdjacent(i, i - direction, direction)) {
                    if (this.cells[i] === opponent) {
                        tilesToFlip.push(i);
                        i += direction;
                    } else if (this.cells[i] === player) {
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
        },
        flipStones(index) {
            const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
            const directions = [-1, 1, -8, 8, -7, -9, 7, 9];

            directions.forEach((direction) => {
                let tilesToFlip = [];
                let i = index + direction;
                let tilesFlippable = false;

                while (i >= 0 && i < 256 && this.isAdjacent(i, i - direction, direction)) {
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
        ,
        checkGameOver() {
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

};
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
  
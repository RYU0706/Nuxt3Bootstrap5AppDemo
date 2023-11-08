<template>
    <div class="game-container">
        <!-- 現在のプレイヤーを表示 -->
        <div class="current-player">
            Current Player:
            <img v-if="currentPlayer === 'black'" src="../assets/black.png" alt="Black Stone">
            <img v-if="currentPlayer === 'white'" src="../assets/white.png" alt="White Stone">
        </div>
        <!-- 黒のカウント表示 -->
        <div class="count black-count">
            <img src="../assets/black.png" alt="Black Stone" class="stone-image">
            <span>{{ blackStonesCount }}</span>
        </div>
        <!-- 白のカウント表示 -->
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
                <p :class="{ 'winner': isWhiteWinner }">白: <span v-if="isWhiteWinner">WIN</span><span v-else>LOSE</span></p>
                <p :class="{ 'winner': isBlackWinner }">黒: <span v-if="isBlackWinner">WIN</span><span v-else>LOSE</span></p>
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
        const cells = Array(64).fill(null); // 8x8 board
        // 中央の4マスに初期石を配置
        const middle = 8 / 2;
        cells[middle * 8 + middle - 1] = 'white';
        cells[middle * 8 + middle] = 'black';
        cells[(middle - 1) * 8 + middle - 1] = 'black';
        cells[(middle - 1) * 8 + middle] = 'white';
        return {
            cells,
            currentPlayer: 'black', // 最初のプレイヤー
            isPass: false, // パスが必要かどうかのフラグ
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

            // ゲームオーバーのチェックを行う
            if (!this.canPlayerMakeMove('white') && !this.canPlayerMakeMove('black')) {
                // どちらのプレイヤーも手を打てない場合、ゲームを終了する
                this.isGameOver = true;
                this.calculateScores();
            } else if (!this.canPlayerMakeMove(this.currentPlayer)) {
                // 現在のプレイヤーが手を打てない場合、パスを行う
                this.isPass = true;
                setTimeout(() => {
                    this.isPass = false;
                    this.switchPlayer(); // 再度プレイヤーを交代し、ゲームオーバーのチェックを行う
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
                -1, // 左
                1, // 右
                -8, // 上
                8, // 下
                -7, // 右上
                -9, // 左上
                7, // 右下
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
                -1, // 左
                1, // 右
                -8, // 上
                8, // 下
                -7, // 右上
                -9, // 左上
                7, // 右下
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
    /* 画像の幅を50pxに設定 */
    height: 50px;
    /* 画像の高さを50pxに設定 */
    vertical-align: middle;
    /* テキストと中央揃えにする */
}

.board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    /* 8列 */
    grid-template-rows: repeat(8, 1fr);
    /* 8行で各行が同じサイズになるように設定 */
    grid-gap: 5px;
    /* セル間の隙間 */
    width: 80vmin;
    /* 幅と高さの小さい方の80%に設定 */
    height: 80vmin;
    /* 幅と高さの小さい方の80%に設定 */
    margin: 0 auto;
    /* 中央揃え */
}

.scoreboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.stones-count img {
    width: 30px;
    /* 画像の幅を30pxに設定 */
    height: 30px;
    /* 画像の高さを30pxに設定 */
    vertical-align: middle;
    /* テキストと中央揃えにする */
}

.board-container {
    position: relative;
    /* 必要に応じて他のスタイルを追加 */
}

.count {
    position: absolute;
    display: flex;
    align-items: center;
}

.black-count {
    top: 0;
    left: 0;
}

.white-count {
    top: 0;
    right: 0;
}

.stone-image {
    width: 80px;
    /* 画像のサイズを適宜調整 */
    height: 80px;
    /* 画像のサイズを適宜調整 */
    margin-right: 10px;
    /* 画像とテキストの間隔 */
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
    /* 半透明の背景 */
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
    /* この色をより明るい色に変更するか、背景色とのコントラストを高める */
}

.score-display {
    font-size: 1.5em;
    margin: 10px 0;
}

.winner {
    color: gold;
    font-weight: bold;
}

/* 勝者でない方のテキストのスタイル */
p:not(.winner) {
    color: black;
}
</style>
  
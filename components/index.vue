<template>
  <div class="game-board">
    <div v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="board-row">
      <div
        v-for="(cell, cellIndex) in row"
        :key="`cell-${rowIndex}-${cellIndex}`"
        :class="getCellClass(cell, rowIndex, cellIndex)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: [
        // 0: 空きスペース, 1: 壁, 2: ドット, 3: パックマン, 4: ゴースト
        [1, 1, 1, 1, 1, 1, 1],
        [1, 3, 2, 0, 2, 4, 1],
        [1, 2, 1, 2, 1, 2, 1],
        [1, 0, 2, 0, 2, 0, 1],
        [1, 1, 1, 1, 1, 1, 1],
      ],
      pacman: {
        x: 1, // パックマンの初期X位置
        y: 1, // パックマンの初期Y位置
        direction: 'right', // 初期方向
      },
      ghosts: [
        { x: 5, y: 1, color: 'red' },
        // 他のゴーストのデータをここに追加
      ],
    };
  },
  methods: {
    getCellClass(cell, rowIndex, cellIndex) {
      if (this.pacman.x === cellIndex && this.pacman.y === rowIndex) {
        return 'pacman';
      }
      const ghost = this.ghosts.find(ghost => ghost.x === cellIndex && ghost.y === rowIndex);
      if (ghost) {
        return `ghost ${ghost.color}`;
      }
      switch (cell) {
        case 0:
          return 'empty';
        case 1:
          return 'wall';
        case 2:
          return 'dot';
        default:
          return '';
      }
    },
    // ここにパックマンやゴーストの動きを制御するメソッドを追加
  },
  // ここにmountedなどのライフサイクルメソッドを追加
};
</script>

<style>
.game-board {
  display: flex;
  flex-direction: column;
}
.board-row {
  display: flex;
}
.cell {
  width: 80px; /* セルの幅 */
  height: 60px; /* セルの高さ */
}
.wall {
  background-color: blue;
}
.dot {
  background-color: black;
}
.empty {
  background-color: white;
}
.pacman {
  background-color: yellow;
  border-radius: 50%;
}
.ghost {
  width: 80px;
  height: 60px;
  border-radius: 50%;
  position: relative;
}
.red {
  background-color: red;
}
/* 他のゴーストの色も同様に追加 */
</style>

<template>
    <div class="cell" @click="$emit('click')">
      <img v-if="cell === 'black'" src="../assets/black.png" class="stone">
      <img v-if="cell === 'white'" src="../assets/white.png" class="stone">
    </div>
  </template>
  
  <script>
  export default {
    name: 'OthelloCell',
    props: ['cell']
  }
  </script>
  
  <style scoped>
  .cell {
    width: 100%;
    height: 100%;
    background-color: green; /* または盤面の色に合わせて調整 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .stone {
    width: 80%; /* セルの幅に対して石のサイズを設定 */
    height: 80%; /* セルの高さに対して石のサイズを設定 */
    border-radius: 50%; /* 丸みを持たせる */
    object-fit: cover; /* 画像のアスペクト比を保ちつつ、コンテナに合わせてトリミング */
  }
  </style>
  
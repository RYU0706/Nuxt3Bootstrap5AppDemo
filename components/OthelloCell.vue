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
    background-color: green;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .stone {
    width: 80%;
    height: 80%; 
    border-radius: 50%;
    object-fit: cover;
  }
  </style>
  
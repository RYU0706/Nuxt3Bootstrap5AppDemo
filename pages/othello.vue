<template>
    <div id="app">
      <OthelloBoard />
    </div>
  </template>
  
  <script>
  import OthelloBoard from './components/OthelloBoard.vue'
  
  export default {
    name: 'App',
    components: {
      OthelloBoard
    }
  }
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  </style>
  
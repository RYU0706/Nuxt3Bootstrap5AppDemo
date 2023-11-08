<template>
  <div class="container">
    <h1 class="text-center my-4">Vue.js Othello Game</h1>
    <OthelloBoard />
  </div>
</template>

<script>
export default {
  // 他のコンポーネントのオプション...

  head() {
    return {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ]
    }
  }
}
</script>

<style>
/* ここにページ固有のスタイルを追加できます */
</style>

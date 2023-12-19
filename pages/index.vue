<template>
  <div>
    <Nuxt /> <!-- ページコンテンツ -->
    <h1>オセロゲームへようこそ！</h1>
    <router-link to="/othello">ゲームを始める</router-link>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue';

export default {
  components: {
    AppHeader
  }
};
</script>

<style>
/* ここにスタイルを追加できます */
</style>

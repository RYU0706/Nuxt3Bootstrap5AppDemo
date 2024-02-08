<template>
  <div class="game-over-container">
    <h1>ゲーム終了</h1>
    <p>白: {{ whiteScore }} - 黒: {{ blackScore }}</p>
    <p v-if="whiteScore > blackScore">白の勝ち！</p>
    <p v-else-if="blackScore > whiteScore">黒の勝ち！</p>
    <p v-else>引き分け！</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  whiteScore: Number,
  blackScore: Number
});
</script>



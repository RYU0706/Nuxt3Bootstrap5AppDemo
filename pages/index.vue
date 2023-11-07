<template>
  <div>
    <div>
      <img class="sample-image" :src="sampleImageSrc" alt="Sample Image" />
      <p>この画像と同じものをタップしてください</p>
    </div>
    <div>
      <TapImage v-for="(image, index) in images" :key="index" :src="image.src" :isTarget="image.isTarget" @tapped="handleTap(image.isTarget)" />
    </div>
    <p>ポイント: {{ points }}</p>
    <p>残り時間: {{ remainingTime }}秒</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TapImage from '~/components/TapImage.vue';

export default {
  components: {
    TapImage
  },
  computed: {
    ...mapState('game', [
      'images',
      'points',
      'remainingTime'
    ])
  },
  methods: {
    ...mapActions('game', ['handleTap'])
  },
  mounted() {
    this.setupGame();
    this.startTimer();
  }
};
</script>

// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    images: [],
    points: 0,
    remainingTime: 30
  },
  mutations: {
    setImages(state, images) {
      state.images = images;
    },
    setPoints(state, points) {
      state.points = points;
    },
    setRemainingTime(state, remainingTime) {
      state.remainingTime = remainingTime;
    }
  },
  actions: {
    async getImages() {
      const response = await fetch('/api/images');
      const data = await response.json();

      this.commit('setImages', data);
    },
    handleTap(state, isTarget) {
      if (isTarget) {
        state.points += 1;
        this.getImages();
      } else {
        state.points -= 1;
      }
    }
  }
});

// api/images.js
import axios from 'axios';

export default axios.get('/api/images');
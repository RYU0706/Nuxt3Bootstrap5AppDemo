<template>
  <div>
    <div>
      <img class="sample-image" :src="sampleImageSrc" alt="Sample Image" />
      <!-- ここに sample-image クラスを追加 -->
      <p>この画像と同じものをタップしてください</p>
    </div>
    <div>
      <TapImage v-for="(image, index) in images" :key="index" :src="image.src" :isTarget="image.isTarget" @tapped="handleTap(image.isTarget)" />
    </div>
    <p>ポイント: {{ points }}</p>
    <p>残り時間: {{ remainingTime }}秒</p>
  </div>
</template>


<style scoped>
.sample-image {
  width: 150px; /* 例: 150pxに設定 */
  height: auto;
}

/* TapImageコンポーネントの画像サイズも指定したい場合 */
TapImage img {
  width: 100px !important; /* 例: 100pxに設定 */
  height: auto !important;
}
</style>


<script>
import TapImage from '~/components/TapImage.vue';

export default {
  components: {
    TapImage
  },
  data() {
    return {
      images: [],
      sampleImageSrc: '',
      points: 0,
      remainingTime: 30
    };
  },
  methods: {
    handleTap(isTarget) {
      if (isTarget) {
        this.points += 1;
        this.setupGame();
      } else {
        this.points -= 1;
      }
    },
    startTimer() {
      setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime -= 1;
        } else {
          alert('ゲーム終了！ ポイント: ' + this.points);
        }
      }, 1000);
    },
    setupGame() {
  const targetIndex = Math.floor(Math.random() * 6); // 6種類の画像があるため、ランダムの範囲を0-5に変更
  this.sampleImageSrc = `/image${targetIndex + 1}.png`; // サンプル画像のパスを修正
  this.images = [
    { src: '/image1.png', isTarget: targetIndex === 0 },
    { src: '/image2.png', isTarget: targetIndex === 1 },
    { src: '/image3.png', isTarget: targetIndex === 2 },
    { src: '/image4.png', isTarget: targetIndex === 3 },
    { src: '/image5.png', isTarget: targetIndex === 4 },
    { src: '/image6.png', isTarget: targetIndex === 5 },
  ];
}

  },
  mounted() {
    this.setupGame();
    this.startTimer();
  }
}
</script>

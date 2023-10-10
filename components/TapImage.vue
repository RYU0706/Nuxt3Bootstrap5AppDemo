<template>
    <div @click="handleTap">
      <img :src="src" alt="Tap Image" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      isTarget: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleTap() {
        this.$emit('tapped', this.isTarget);
      }
    }
  }
  </script>
  
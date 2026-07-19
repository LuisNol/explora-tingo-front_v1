<template>
  <div class="processing-circle-container">
    <div ref="lottieContainer" class="processing-circle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import lottie from "lottie-web";
import animationData from "@/assets/animations/processing-circle.json";

const lottieContainer = ref<HTMLDivElement | null>(null);
let animation: any = null;

const props = defineProps({
  speed: {
    type: Number,
    default: 1,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
});

onMounted(() => {
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: "svg",
      loop: props.loop,
      autoplay: props.autoplay,
      animationData: animationData,
    });
    if (animation) {
      animation.setSpeed(props.speed);
    }
  }
});

watch(
  () => props.speed,
  (newSpeed) => {
    if (animation) {
      animation.setSpeed(newSpeed);
    }
  }
);
</script>

<style scoped>
.processing-circle-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.processing-circle {
  width: 100%;
  height: 100%;
}
</style>

<!-- src/components/GlobalLoading.vue -->
<template>
  <v-dialog
    v-model="loading.isLoading"
    persistent
    fullscreen
    class="d-flex justify-center align-center"
    scrim="rgba(0, 0, 0, 1)"
  >
    <div class="d-flex flex-column justify-center align-center" style="width: 100%; height: 100%;">
      <DotLottieVue style="height: 140px; width: 140px;" autoplay loop src="https://lottie.host/5f479e05-474b-4067-a465-45390204e86d/Eq2dP5xyOm.lottie" />
      <v-chip class="text-body-2 mt-4 loading-text bg-blue-grey-darken-3">{{loading.message}}</v-chip>
    </div>
  </v-dialog>
</template>

<script setup>
  import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
  import { useLoadingStore } from '@/modulos/Shared/Domain/Stores/loading'

  const loading = useLoadingStore()
</script>

<style scoped>

.loading-text {
  color: #ffffff;
  animation: colorFade 3s ease-in-out infinite, textGlow 3s ease-in-out infinite;
  font-weight: 500;
}

@keyframes colorFade {
  0%, 100% {
    color: #eeeeee;
    opacity: 1;
  }
  25% {
    color: #dbdbdb;
    opacity: 0.9;
  }
  50% {
    color: #eeeeee;
    opacity: 0.9;
  }
  75% {
    color: #dbdbdb;
    opacity: 0.9;
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.603);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.836);
  }
}
</style>

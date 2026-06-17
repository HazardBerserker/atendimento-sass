
<template>
  <router-view v-slot="{ Component }">
    <Transition name="route" mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </router-view>
  <GlobalLoading />
  <GlobalAlert />
  <GlobalDialogConfirm ref="dialogRef" />
  <PwaPrompt />
</template>

<script setup>
  import { ref, provide, onMounted } from 'vue'
  import GlobalLoading from '@/modulos/Shared/Components/GlobalComponents/GlobalLoading.vue'
  import GlobalAlert from '@/modulos/Shared/Components/GlobalComponents/GlobalAlert.vue'
  import GlobalDialogConfirm from '@/modulos/Shared/Components/GlobalComponents/GlobalDialogConfirm.vue'
  import PwaPrompt from '@/modulos/Shared/Components/GlobalComponents/PwaPrompt.vue'
  import { useTema } from '@/modulos/Shared/Domain/Composables/useTema'

  const dialogRef = ref()
  provide('dialog', dialogRef)

  onMounted(() => {
    const { definirTemaInicial } = useTema()
    definirTemaInicial()
  })
</script>


<style scoped>

html, body, #app {
  transition:
    background-color 0.7s ease,
    color 0.7s ease;
}

.v-application {
  transition:
    background-color 0.7s ease,
    color 0.7s ease;
}

.v-main,
.v-container,
.v-app-bar,
.v-navigation-drawer {
  transition: background-color 0.7s ease, color 0.7s ease;
}
</style>

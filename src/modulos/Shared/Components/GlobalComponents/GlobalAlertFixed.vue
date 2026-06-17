<template>
  <v-slide-x-transition mode="out-in">
    <v-alert
      v-if="propriedadesDoAlerta != null"
      :text="propriedadesDoAlerta.text"
      :title="propriedadesDoAlerta.title"
      :type="propriedadesDoAlerta.type"
      :color="propriedadesDoAlerta.type === 'error' ? 'red-darken-4' : alert.type === 'warning' ? 'yellow-darken-4' : 'green-darken-4'"
      border="start"
      closable
    >
    </v-alert>
  </v-slide-x-transition>
</template>

<script>
export default {
  name: 'GlobalAlertFixed',
  props: {
    propriedadesDoAlerta: {
      type: Object,
      default: null
    }
  }
}
</script>

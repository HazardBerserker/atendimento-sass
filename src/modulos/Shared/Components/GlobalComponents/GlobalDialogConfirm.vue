<template>
  <v-dialog v-model="dialog" max-width="450" persistent :content-class="contentClasses">
    <v-card elevation="12" class="pa-0 rounded-lg">
      <v-sheet :class="'px-4 py-3'" :color="localColor" rounded-t>
        <div class="text-h6 white--text" v-html="localTitle"></div>
      </v-sheet>

      <v-card-text class="pt-4 pb-2">
        <div v-html="localMessage"></div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn text color="grey-darken-1" @click="cancel">Não</v-btn>
        <v-btn text color="primary" @click="confirm">Sim</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    titleColor: { type: String, default: 'primary' }
  },
  data() {
    return {
      dialog: false,
      resolve: null,
      localTitle: '',
      localMessage: '',
      localColor: 'primary'
    };
  },
  computed: {
    contentClasses() {
      return 'rounded-dialog-bg';
    }
  },
  methods: {
    open({ title, message, titleColor = 'primary' }) {
      this.localTitle = title;
      this.localMessage = message;
      this.localColor = titleColor;
      this.dialog = true;
      return new Promise(res => (this.resolve = res));
    },
    confirm() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    }
  }
};
</script>

<style>
.rounded-dialog-bg {
  border-radius: 16px !important;
}
</style>

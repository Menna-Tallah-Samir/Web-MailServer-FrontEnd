<template>
  <v-dialog v-model="show" max-width="500px" persistent>
    <v-card class="pa-3">

      <v-card-text class="headline pa-4">
        {{ message }}
      </v-card-text>
        <v-btn color="primary" text @click.stop="show=false">Ok</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "emailView",
  props: {
    value: Boolean,
    message: String,

  },
  data(){
    return {

    }

  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

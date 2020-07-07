<template>
  <v-img :src="url" :lazy-src="url" class="mx-sm-auto">
    <template v-slot:placeholder>
      <v-row class="ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class AttachmentImage extends Vue {
  @Prop() readonly url!: string;
}
</script>
<style lang="scss" scoped></style>

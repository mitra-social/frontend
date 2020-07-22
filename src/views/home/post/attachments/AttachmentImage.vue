<template>
  <v-img class="mx-sm-auto" :src="url" :lazy-src="url" :alt="title">
    <template v-slot:placeholder>
      <v-row class="ma-0" align="center" justify="center">
        <v-progress-circular
          color="grey lighten-5"
          indeterminate
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
  @Prop() readonly title!: string;
}
</script>
<style lang="scss" scoped></style>

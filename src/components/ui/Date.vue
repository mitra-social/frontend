<template>
  <div>
    <v-icon class="body-1" v-if="icon">{{ icon }}</v-icon>
    <span v-if="label">{{ label }}: </span>{{ date | postDate }}
    <span class="caption text--secondary">({{ date | postDateDistance }})</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MitraDate extends Vue {
  @Prop() readonly date!: string;
  @Prop() readonly label!: string;
  @Prop() readonly icon!: string;
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}

.post {
  margin: 5px;
}

.v-card__text {
  width: inherit;
}
</style>

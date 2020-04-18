<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MitraFollowers extends Vue {
  private title = "Followers";
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  overflow: scroll;
  text-align: center;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

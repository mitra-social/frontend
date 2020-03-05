<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MitraHeader extends Vue {
  private title = "Header";
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  text-align: center;
  color: white;
  background-color: red;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

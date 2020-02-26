<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MitraPosts extends Vue {
  private title = "Posts";
}
</script>

<style lang="scss" scoped>
div {
  padding-top: 12px;
  height: 90vh;
  text-align: center;
  color: black;
  background-color: green;
}
</style>

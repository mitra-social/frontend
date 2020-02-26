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
  padding-top: 12px;
  height: 90vh;
  text-align: center;
  color: black;
  background-color: blue;
}
</style>

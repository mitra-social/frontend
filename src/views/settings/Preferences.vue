<template>
  <div class="content" no-gutters>
    <h1>
      Preferences
    </h1>
    <v-divider></v-divider>
    content
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Preferences extends Vue {}
</script>

<style lang="scss">
.v-divider {
  color: #333;
  height: 3px;
}
</style>

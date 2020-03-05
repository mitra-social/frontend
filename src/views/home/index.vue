<template>
  <v-row class="content" align="stretch" no-gutters>
    <v-col class="col-3">
      <Followers />
    </v-col>
    <v-col>
      <Posts />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Followers from "./Followers.vue";
import Posts from "./Posts.vue";

@Component({
  components: {
    Followers,
    Posts
  }
})
export default class MitraHome extends Vue {
  private title = "Home";
}
</script>

<style lang="scss">
.content {
  text-align: center;
  color: black;
  background-color: gainsboro;
}
</style>

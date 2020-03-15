<template>
  <div class="content" no-gutters>
    <div class="followers">
      <Followers />
    </div>
    <div class="posts">
      <Posts />
    </div>
  </div>
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  color: black;
  background-color: gainsboro;
}

.followers {
  flex: 0 0 25%;
  max-width: 25%;
}

.posts {
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
}
</style>

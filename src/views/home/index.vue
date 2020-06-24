<template>
  <div class="home-content" no-gutters>
    <div class="following-actors">
      <FollowingActors />
    </div>
    <div class="posts">
      <Posts />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import FollowingActors from "./FollowingActors.vue";
import Posts from "./post/Posts.vue";
import { User } from "@/model/user";

const userStore = namespace("User");

@Component({
  components: {
    FollowingActors,
    Posts,
  },
})
export default class MitraHome extends Vue {
  @userStore.Getter
  public getUser!: User;
}
</script>

<style lang="scss">
body {
  background-color: #333;
}
.home-content {
  height: 100%;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  min-height: 0px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.following-actors,
.posts {
  height: 100%;
  overflow: auto;
}

.following-actors {
  flex: 0 0 30%;
  max-width: 30%;
}

.posts {
  flex-basis: 0;
  flex-grow: 1;
  width: 100%;
}
</style>

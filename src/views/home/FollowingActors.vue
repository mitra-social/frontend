<template>
  <div class="follower-container">
    <v-list>
      <v-list-item-group color="primary">
        <FollowingActor
          v-for="(following, index) in getFollowing"
          :key="index"
          :actor="following"
        />
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ActivityObject, Link } from "activitypub-objects";

import FollowingActor from "@/components/following/FollowingActor.vue";

const followingStore = namespace("Following");

@Component({
  components: {
    FollowingActor,
  },
})
export default class FollowingActors extends Vue {
  private title = "Following";

  @followingStore.Getter
  public getFollowing!: Array<ActivityObject | Link>;
}
</script>

<style lang="scss" scoped>
.follower-container {
  height: 100%;
  overflow: scroll;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}
</style>

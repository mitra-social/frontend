<template>
  <div
    id="scroll-target"
    class="post-container"
    v-if="actors && actors.length > 0"
  >
    {{ hasNextPage }}
    <v-list>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(actor, index) in actors"
          :key="index"
          v-intersect="onIntersect"
          :data-index="index"
        >
          <v-list-item-avatar v-if="getIcon(actor)">
            <v-img :src="getIcon(actor)"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ getName(actor) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { Actor, ActivityObject, Link } from "activitypub-objects";

import client from "apiClient";

import FollowingActor from "@/components/following/FollowingActor.vue";
import SummarizedActor from "@/components/actor/ActorSummarized.vue";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
// import { User } from "../../model/user";

const findUserStore = namespace("FindUser");

@Component({
  components: {
    FollowingActor,
    SummarizedActor,
  },
})
export default class FollowingFollowerList extends Vue {
  @Prop() readonly actors!: (ActivityObject | Link | URL)[];
  @Prop() readonly isLoading!: boolean;
  @Prop() readonly hasNextPage!: boolean;

  // private tab = "";

  // public setfollowersOrFollowing(
  //   fof: (ActivityObject | Link | URL)[] | undefined,
  //   isFollowerActive: boolean,
  //   isFollowingActive: boolean
  // ): void {
  //   this.isFollowerActive = isFollowerActive;
  //   this.isFollowingActive = isFollowingActive;

  //   if (fof) {
  //     this.followersOrFollowing = fof;
  //   }
  // }

  public getName(actor: ActivityObject | Link | URL): string | undefined {
    return ActivityObjectHelper.extractActorName(actor);
  }

  public getIcon(actor: ActivityObject | Link | URL): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      actor as ActivityObject
    );

    return client.getMedia(originalIconUri);
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    if (this.hasNextPage && entries[0].isIntersecting) {
      const target: Element = entries[0].target as Element;
      const index: number = +(target.getAttribute("data-index") ?? 0);

      if (index > this.actors.length - 3 && !this.isLoading) {
        this.$emit("nextPage");
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}

.follower-container {
  height: 100%;
  overflow: scroll;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}

.action-all {
  padding-left: 32px;
}
</style>

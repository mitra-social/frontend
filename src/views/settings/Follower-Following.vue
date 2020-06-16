<template>
  <div no-gutters>
    <h1>
      Follower And Following
    </h1>
    <v-divider></v-divider>
    <v-list subheader>
      <v-subheader>Recent chat</v-subheader>
      <template v-for="(following, idx) in getFollowing">
        <v-list-item :key="`item-${idx}`">
          <v-list-item-action>
            <v-icon
              v-if="!isSelected({ id: idx, actor: following.actor })"
              @click="select({ id: idx, actor: following.actor })"
              >mdi-checkbox-blank-circle-outline</v-icon
            >
            <v-icon
              v-else
              @click="unselect({ id: idx, actor: following.actor })"
              >mdi-checkbox-marked-circle-outline</v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <ActorPin v-if="following.actor" :actor="following.actor" />
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon :color="following.show ? 'deep-purple accent-4' : 'grey'"
              >chat_bubble</v-icon
            >
          </v-list-item-icon>
        </v-list-item>
        <v-divider :key="`divider-${idx}`"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";

import ActorPin from "@/components/actor/ActorPin.vue";
import { Following } from "@/model/following";
import { User } from "@/model/user";
import { ActorItem } from "@/model/actor-item";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { ActivityObject } from "activitypub-objects";

const userStore = namespace("User");
const followingStore = namespace("Following");

@Component({
  components: {
    ActorPin,
  },
})
export default class FollowerFollowing extends Vue {
  private isFollowingLoading = false;
  private selectedList: ActorItem[] = [];

  @userStore.Getter
  public getUser!: User;

  @followingStore.Getter
  public getFollowing!: Array<Following>;

  @followingStore.Action
  public fetchFollowing!: (user: string) => Promise<void>;

  public name(actor: ActivityObject): string | undefined {
    return ActivityObjectHelper.extractActorName(actor);
  }

  public icon(actor: ActivityObject): string | undefined {
    return ActivityObjectHelper.extractIcon(actor);
  }

  public isSelected(actor: ActorItem): boolean {
    return this.selectedList.some(($) => $.id === actor.id);
  }

  public select(actor: ActorItem): void {
    this.selectedList.push(actor);
  }

  public unselect(actor: ActorItem): void {
    this.selectedList = this.selectedList.filter(($) => $.id !== actor.id);
  }

  private created(): void {
    if (this.getUser) {
      this.fetchFollowing(this.getUser.preferredUsername).then(() => {
        this.isFollowingLoading = true;
      });
    }
  }
}
</script>

<style lang="scss">
.v-divider {
  color: #333;
  height: 3px;
}
</style>

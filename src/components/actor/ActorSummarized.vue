<template>
  <v-card :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark">
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-if="icon">
          <v-img :src="icon"></v-img>
        </v-list-item-avatar>
        <v-list-item-avatar v-else>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ actor }}</v-list-item-title>
          <v-list-item-subtitle>{{ attributedTo.type }}</v-list-item-subtitle>
          <v-list-item-subtitle v-if="attributedTo.summary">{{
            attributedTo.summary
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon v-if="isFollowing()" @click="onUnfollow()">
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
          <v-btn icon v-else @click="onFollow()">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ActivityObject, Link, Actor } from "activitypub-objects";

import { User } from "@/model/user";
import { FollowPayload } from "@/model/follow-payload";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

const userStore = namespace("User");
const followingStore = namespace("Following");

@Component
export default class ActorSummarized extends Vue {
  @Prop() readonly attributedTo!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;

  get actor(): string | undefined {
    return ActivityObjectHelper.extractActorName(
      this.attributedTo as ActivityObject
    );
  }

  get icon(): string | undefined {
    return ActivityObjectHelper.extractIcon(
      this.attributedTo as ActivityObject
    );
  }

  @userStore.Getter
  public getUser!: User;

  @followingStore.Getter
  public getFollowing!: Actor[];

  @followingStore.Action
  public fetchFollowing!: (user: string) => Promise<void>;

  @followingStore.Action
  public setIsFollowing!: (actor: string) => void;

  @followingStore.Action
  public follow!: (payload: FollowPayload) => Promise<void>;

  @followingStore.Action
  public unfollow!: (payload: FollowPayload) => Promise<void>;

  private isFollowing(): boolean {
    return this.getFollowing.some($ =>
      (this.attributedTo as Actor).name
        ? $.name === (this.attributedTo as Actor).name
        : $ === this.attributedTo
    );
  }

  private onFollow() {
    const actorFollowing = ActivityObjectHelper.convertToActor(
      this.attributedTo
    );
    this.follow({
      user: this.getUser,
      object: actorFollowing
    })
      .then(() => {
        this.isFollowing();
      })
      .catch(() => {
        this.$toast.error(`Follow ${actorFollowing} failed.`);
      });
  }

  private onUnfollow() {
    const actorFollowing = ActivityObjectHelper.convertToActor(
      this.attributedTo
    );
    this.unfollow({
      user: this.getUser,
      object: actorFollowing as ActivityObject
    })
      .then(() => {
        this.isFollowing();
      })
      .catch(() => {
        this.$toast.error(`Unfollow ${actorFollowing} failed.`);
      });
  }
}
</script>

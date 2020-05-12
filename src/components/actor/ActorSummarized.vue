<template>
  <v-card
    :light="$vuetify.theme.dark"
    :dark="!$vuetify.theme.dark"
    v-if="actor"
  >
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-if="actor.icon">
          <v-img :src="actor.icon"></v-img>
        </v-list-item-avatar>
        <v-list-item-avatar v-else>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ actor.name }}</v-list-item-title>
          <v-list-item-subtitle class="attribute-type" v-if="actor.type">{{
            actor.type
          }}</v-list-item-subtitle>
          <v-list-item-subtitle
            class="attribute-summary"
            v-if="actor.summary"
            >{{ actor.summary }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            class="following-btn"
            icon
            v-if="isFollowing()"
            @click="onUnfollow()"
          >
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
          <v-btn class="following-btn" icon v-else @click="onFollow()">
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

import { User } from "@/model/user";
import { FollowPayload } from "@/model/mitra-follow-payload";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Actor } from "@/model/mitra-actor";
import { DisplayActor } from "@/model/display-actor";

const userStore = namespace("User");
const followingStore = namespace("Following");

@Component
export default class ActorSummarized extends Vue {
  @Prop() readonly actor!: DisplayActor;

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
    return this.getFollowing.some(
      $ => ActivityObjectHelper.extractId($) === this.actor.id
    );
  }

  private onFollow() {
    if (this.actor.to) {
      this.follow({ to: this.actor.to, object: this.actor.to })
        .then(() => {
          this.isFollowing();
        })
        .catch(() => {
          this.$toast.error(`Follow ${this.actor.name} failed.`);
        });
    } else {
      this.$toast.error(`Follow ${this.actor.name} failed.`);
    }
  }

  private onUnfollow() {
    if (this.actor.to) {
      this.unfollow({ to: this.actor.to, object: this.actor.to })
        .then(() => {
          this.isFollowing();
        })
        .catch(() => {
          this.$toast.error(`Unfollow  ${this.actor.name} failed.`);
        });
    } else {
      this.$toast.error(`Follow ${this.actor.name} failed.`);
    }
  }
}
</script>

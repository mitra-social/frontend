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
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle class="attribute-type" v-if="actor.type">{{
            actor.type
          }}</v-list-item-subtitle>
          <v-list-item-subtitle
            class="attribute-summary"
            v-if="actor.summary && !noSummary"
            v-html="actor.summary"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            class="following-btn"
            icon
            v-if="isFollowing(actor)"
            @click="onUnfollow()"
          >
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
          <v-btn class="following-btn" icon v-else @click.stop="onFollow()">
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

import client from "apiClient";
import { User } from "@/model/user";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

const userStore = namespace("User");
const followingStore = namespace("Following");

@Component
export default class ActorSummarized extends Vue {
  @Prop() readonly actor!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;
  @Prop() readonly noSummary!: boolean;

  get name(): string | undefined {
    return ActivityObjectHelper.extractActorName(this.actor as ActivityObject);
  }

  get icon(): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      this.actor as ActivityObject
    );

    return client.getMedia(originalIconUri);
  }

  @userStore.Getter
  public getUser!: User;

  @followingStore.Getter
  public getFollowing!: Actor[];

  @followingStore.Getter
  public isFollowing!: boolean;

  @followingStore.Action
  public follow!: (actor: Actor) => Promise<void>;

  @followingStore.Action
  public unfollow!: (actor: Actor) => Promise<void>;

  private onFollow() {
    this.follow(this.actor as Actor);
  }

  private onUnfollow() {
    this.unfollow(this.actor as Actor);
  }
}
</script>

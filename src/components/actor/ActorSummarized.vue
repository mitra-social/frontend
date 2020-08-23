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
          <v-list-item-title id="summarized-name">{{ name }}</v-list-item-title>
          <v-list-item-subtitle
            id="summarized-type"
            class="attribute-type"
            v-if="actor.type"
            >{{ actor.type }}</v-list-item-subtitle
          >
          <v-list-item-subtitle
            id="summarized-summary"
            class="attribute-summary"
            v-if="actor.summary && !noSummary"
            v-html="actor.summary"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action id="summarized-follow-action">
          <v-btn
            class="following-btn"
            icon
            v-if="isFollowing(actor)"
            @click="unfollow(actor)"
          >
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
          <v-btn class="following-btn" icon v-else @click.stop="follow(actor)">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { ActivityObject, Link } from "activitypub-objects";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import client from "apiClient";
import { InternalActor } from "@/model/internal-actor";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

const followingStore = namespace("Following");
const userStore = namespace("User");

@Component
export default class ActorSummarized extends Vue {
  /************************
   * components properties
   ************************/

  @Prop() readonly actor!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;
  @Prop() readonly noSummary!: boolean;

  /**********************
   * computed properties
   **********************/
  get name(): string | undefined {
    return ActivityObjectHelper.extractActorName(this.actor as ActivityObject);
  }

  get icon(): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      this.actor as ActivityObject
    );

    return client.getMedia(originalIconUri);
  }

  /**********************
   * store getters
   **********************/
  @userStore.Getter
  public getUser!: InternalActor;

  @followingStore.Getter
  public isFollowing!: boolean;

  /**********************
   * store actions
   **********************/
  @followingStore.Action
  public follow!: (actor: InternalActor) => Promise<void>;

  @followingStore.Action
  public unfollow!: (actor: InternalActor) => Promise<void>;
}
</script>

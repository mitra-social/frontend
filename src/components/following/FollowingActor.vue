<template>
  <v-list-item inactive v-if="following">
    <v-list-item-avatar>
      <v-img :src="icon" v-if="icon"></v-img>
      <v-icon v-else>mdi-account-circle</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-html="name"></v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        class="following-btn"
        icon
        v-if="!following.show"
        @click="toggleExcludeActor(following, false)"
      >
        <v-icon>mdi-eye-off</v-icon>
      </v-btn>
      <v-btn
        class="following-btn"
        icon
        v-else
        @click="toggleExcludeActor(following, true)"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject } from "activitypub-objects";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

import client from "apiClient";
import { Following } from "@/model/following";
import { namespace } from "vuex-class";

const collectionStore = namespace("Collection");

@Component
export default class FollowingActor extends Vue {
  @Prop() readonly following!: Following;

  get name(): string | undefined {
    return ActivityObjectHelper.extractActorName(
      this.following.actor as ActivityObject
    );
  }

  get icon(): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      this.following.actor as ActivityObject
    );
    return client.getMedia(originalIconUri);
  }

  @collectionStore.Action
  public addExcludeActor!: (actorId: string) => void;

  @collectionStore.Action
  public removeActorFromExclude!: (actorId: string) => void;

  private toggleExcludeActor(following: Following, isAdd: boolean) {
    const id = ActivityObjectHelper.extractId(following.actor);

    if (!id) {
      return;
    }

    if (isAdd) {
      this.addExcludeActor(id);
      following.show = false;
      return;
    }

    this.removeActorFromExclude(id);
    following.show = true;
  }
}
</script>

<style lang="scss" scoped>
.v-list-item--link:before,
.v-list-item {
  border-bottom-left-radius: 32px !important;
  border-top-left-radius: 32px !important;
}

.v-list-item {
  min-height: 40px;
  height: 42px;
  margin-left: 20px;
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-list-item__avatar {
  margin: 0;
}

.v-icon.v-icon {
  font-size: 42px;
}
</style>

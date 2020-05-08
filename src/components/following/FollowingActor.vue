<template>
  <v-list-item v-if="isLoaded">
    <v-list-item-avatar>
      <v-img :src="icon" v-if="displayActor.icon"></v-img>
      <v-icon v-else>mdi-account-circle</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ displayActor.name }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { Actor } from "@/model/mitra-actor";
import { DisplayActor } from "@/model/display-actor";

@Component
export default class FollowingActor extends Vue {
  @Prop() readonly actor!: ActivityObject | Link;
  private displayActor: DisplayActor | undefined;
  private isLoaded = false;

  private created() {
    ActivityObjectHelper.extractActorName(this.actor as Actor).then(($) => {
      const icon = ActivityObjectHelper.extractIcon(this.actor as Actor);
      const to = ActivityObjectHelper.normalizedObjectFollow(this.actor);
      this.displayActor = {
        id: ActivityObjectHelper.extractId(this.actor),
        name: $,
        icon,
        type: (this.actor as Actor).type ?? undefined,
        summary: (this.actor as Actor).summary ?? undefined,
        to,
      };
      this.isLoaded = true;
    });
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
  padding: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-left: 20px;
}

.v-list-item__avatar {
  margin: 0;
}
</style>

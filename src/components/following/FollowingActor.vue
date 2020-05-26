<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img src="icon" v-if="icon"></v-img>
      <v-icon v-else>mdi-account-circle</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title v-html="name"></v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

@Component
export default class FollowingActor extends Vue {
  @Prop() readonly actor!: ActivityObject | Link;

  get name(): string | undefined {
    return ActivityObjectHelper.extractActorName(this.actor as ActivityObject);
  }

  get icon(): string | undefined {
    const icon = ActivityObjectHelper.extractIcon(this.actor as ActivityObject);
    return icon;
  }
}
</script>

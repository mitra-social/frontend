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

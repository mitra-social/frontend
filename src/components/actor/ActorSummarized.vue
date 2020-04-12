<template>
  <v-card>
    <v-list>
      <v-list-item>
        <v-list-item-avatar v-if="icon">
          <v-img :src="icon"></v-img>
        </v-list-item-avatar>
        <v-list-item-avatar v-else>
          <v-icon dark>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ author }}</v-list-item-title>
          <v-list-item-subtitle>{{ attributedTo.type }}</v-list-item-subtitle>
          <v-list-item-subtitle v-if="attributedTo.summary">{{
            attributedTo.summary
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon color="primary" @click="toggleFollowing()">
            <v-icon v-if="isFollowing">mdi-account-remove</v-icon>
            <v-icon v-else>mdi-account-plus</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";
import { ActivityObjectHelper } from "../../utils/activity-object-helper";

@Component
export default class ActorSummarized extends Vue {
  @Prop() readonly attributedTo!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;
  @Prop() isFollowing!: boolean;

  @Emit("toggleFollowing")
  toggleFollowing(): boolean {
    return !this.isFollowing;
  }

  get author(): string | undefined {
    return ActivityObjectHelper.extractActorName(
      this.attributedTo as ActivityObject
    );
  }

  get icon(): string | undefined {
    return ActivityObjectHelper.extractIcon(
      this.attributedTo as ActivityObject
    );
  }
}
</script>

<style lang="scss" scoped></style>

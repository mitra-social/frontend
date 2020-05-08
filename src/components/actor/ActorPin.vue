<template>
  <v-menu
    v-if="isLoaded"
    open-on-hover
    top
    offset-y
    :close-on-content-click="false"
    :nudge-width="200"
  >
    <template v-slot:activator="{ on }">
      <div v-on="on" v-if="actor">
        <v-avatar color="indigo" size="36" v-if="actor.icon">
          <v-img :src="actor.icon"></v-img>
        </v-avatar>
        <v-avatar color="indigo" size="36" v-else>
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
        {{ actor.name }}
      </div>
    </template>
    <SummarizedActor v-if="attributedTo && actor" :actor="actor" />
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";

import SummarizedActor from "@/components/actor/ActorSummarized.vue";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { DisplayActor } from "@/model/display-actor";
import { Actor } from "../../model/mitra-actor";

@Component({
  components: {
    SummarizedActor,
  },
})
export default class ActorPin extends Vue {
  @Prop() readonly attributedTo!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;
  private actor: DisplayActor | undefined;
  private isLoaded = false;

  private created() {
    ActivityObjectHelper.extractActorName(this.attributedTo as Actor).then(
      ($) => {
        const icon = ActivityObjectHelper.extractIcon(
          this.attributedTo as Actor
        );
        const to = ActivityObjectHelper.normalizedObjectFollow(
          this.attributedTo
        );
        this.actor = {
          id: ActivityObjectHelper.extractId(this.attributedTo),
          name: $,
          icon,
          type: (this.attributedTo as Actor).type ?? undefined,
          summary: (this.attributedTo as Actor).summary ?? undefined,
          to,
        };
        this.isLoaded = true;
      }
    );
  }
}
</script>

<style lang="scss" scoped></style>

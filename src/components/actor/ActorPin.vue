<template>
  <v-menu
    open-on-hover
    top
    offset-y
    :close-on-content-click="false"
    :nudge-width="200"
  >
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-avatar color="indigo" size="36" v-if="icon">
          <v-img :src="icon"></v-img>
        </v-avatar>
        <v-avatar color="indigo" size="36" v-else>
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
        {{ author }}
      </div>
    </template>
    <SummarizedActor
      v-if="this.attributedTo"
      :attributedTo="this.attributedTo"
    />
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";

import SummarizedActor from "@/components/actor/ActorSummarized.vue";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

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

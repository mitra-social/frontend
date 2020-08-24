<template>
  <v-list-item
    v-if="actor"
    link
    @click="filter(actor, disabledFilter)"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    v-model="disabledFilter"
  >
    <v-list-item-avatar>
      <v-img :src="icon" v-if="icon"></v-img>
      <v-icon v-else>mdi-account-circle</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title
        class="d-flex flex-row justify-space-between align-center"
      >
        <div>{{ name }}</div>
        <div class="item-action d-flex flex-row justify-end align-center">
          <v-icon v-if="disabledFilter && !isHover">mdi-filter-outline</v-icon
          ><v-icon v-if="disabledFilter && isHover"
            >mdi-filter-remove-outline</v-icon
          ><v-icon v-if="!disabledFilter && isHover"
            >mdi-filter-plus-outline</v-icon
          >
          <v-btn class="following-btn" icon @click.stop="unfollow(actor)">
            <v-icon>mdi-account-remove</v-icon>
          </v-btn>
        </div>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Actor } from "activitypub-objects";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import client from "apiClient";
import { InternalActor } from "@/model/internal-actor";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";

const collectionStore = namespace("Collection");
const followingStore = namespace("Following");

@Component
export default class FollowingActor extends Vue {
  /**********************
   * data fields
   **********************/
  private value = undefined;
  private disabledFilter = false;
  private isHover = false;

  /************************
   * components properties
   ************************/
  @Prop() readonly actor!: InternalActor;

  /**********************
   * computed properties
   **********************/
  get name(): string | undefined {
    return ActivityObjectHelper.extractActorName(this.actor);
  }

  get icon(): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      this.actor as InternalActor
    );
    return client.getMedia(originalIconUri);
  }

  /**********************
   * store actions
   **********************/
  @collectionStore.Action
  public filterAction!: (filter: string) => void;

  @collectionStore.Action
  public clearfilterAction!: () => void;

  @followingStore.Action
  public unfollow!: (actor: Actor) => Promise<void>;

  /**********************
   * public functions
   **********************/
  public filter(actor: InternalActor, disabledFilter: boolean) {
    if (disabledFilter) {
      this.clearfilterAction();
    } else {
      this.filterAction(actor.internalUserId);
    }
  }
}
</script>

<style lang="scss" scoped>
.item-action {
  width: 55px;

  .v-icon.v-icon {
    font-size: 20px;
  }
}

.v-icon.v-icon {
  font-size: 42px;
}

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
</style>

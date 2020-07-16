<template>
  <v-container fluid>
    <div class="d-flex flex-row align-stretch">
      <v-text-field
        v-model="query"
        flat
        solo-inverted
        hide-details
        label="Search Actor"
        :loading="isLoading"
        @keyup.enter="findUser(query)"
      ></v-text-field>
      <v-btn
        class="ml-1 pa-0"
        height="auto"
        @click="findUser(query)"
        :light="$vuetify.theme.dark"
        :dark="!$vuetify.theme.dark"
        :loading="isLoading"
      >
        <v-icon left>mdi-magnify</v-icon>
      </v-btn>
    </div>
    <v-list v-if="getUser">
      <v-list-item-group color="primary">
        <v-list-item>
          <v-list-item-content>
            <SummarizedActor :actor="getUser" />
            <v-divider></v-divider>
            <div class="d-flex flex-row">
              <v-btn
                class="ma-2"
                @click="setfollowersOrFollowing(true, false)"
                :light="$vuetify.theme.dark"
                :dark="!$vuetify.theme.dark"
                :loading="isFollowersLoading"
              >
                <v-icon left>mdi-account</v-icon>
                {{ getFollowersCollectionCount }} Followers
              </v-btn>
              <v-btn
                class="ma-2"
                @click="setfollowersOrFollowing(false, true)"
                :light="$vuetify.theme.dark"
                :dark="!$vuetify.theme.dark"
                :loading="isFollowingLoading"
              >
                <v-icon left>mdi-account</v-icon>
                {{ getFollowingCollectionCount }} Follows
              </v-btn>
            </div>
            <FollowingFollowerList
              v-if="isFollowerActive"
              :actors="getFollowers"
              :isLoading="isFollowersLoading"
              :hasNextPage="getHasNextFollowerPage"
              @nextPage="nextFollowersPage()"
              @detail="detail($event)"
            />
            <FollowingFollowerList
              v-if="isFollowingActive"
              :actors="getFollowing"
              :isLoading="isFollowingLoading"
              :hasNextPage="getHasNextFollowingPage"
              @nextPage="nextFollowingPage()"
              @detail="detail($event)"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ActivityObject, Link } from "activitypub-objects";

import client from "apiClient";

import FollowingActor from "@/components/following/FollowingActor.vue";
import FollowingFollowerList from "@/components/following/FollowingFollowerList.vue";
import SummarizedActor from "@/components/actor/ActorSummarized.vue";
import { ActivityObjectHelper } from "@/utils/activity-object-helper";
import { User } from "@/model/user";
import { FetchFollowParam } from "@/model/fetch-follow-param";

const findUserStore = namespace("FindUser");

@Component({
  components: {
    FollowingActor,
    SummarizedActor,
    FollowingFollowerList,
  },
})
export default class SearchActor extends Vue {
  public tab = "";
  public isFollowerActive = false;
  public isFollowingActive = false;

  // find user
  @findUserStore.Getter
  public getQuery!: string;

  @findUserStore.Getter
  public getUser!: User;

  @findUserStore.Getter
  public isLoading!: boolean;

  // follower
  @findUserStore.Getter
  public getFollowersCollectionCount!: number;

  @findUserStore.Getter
  public getFollowers!: (ActivityObject | Link | URL)[] | undefined;

  @findUserStore.Getter
  public isFollowersLoading!: boolean;

  @findUserStore.Getter
  public getHasNextFollowerPage!: boolean;

  // following
  @findUserStore.Getter
  public getFollowingCollectionCount!: number;

  @findUserStore.Getter
  public getFollowing!: (ActivityObject | Link | URL)[] | undefined;

  @findUserStore.Getter
  public isFollowingLoading!: boolean;

  @findUserStore.Getter
  public getHasNextFollowingPage!: boolean;

  // find user
  @findUserStore.Action
  public findUser!: (query: string) => void;

  @findUserStore.Action
  public detailUser!: (actor: User) => void;

  @findUserStore.Action
  public queryAction!: (query: string) => void;

  // follower
  @findUserStore.Action
  public fetchFollowers!: ({ url, add }: FetchFollowParam) => void;

  // following
  @findUserStore.Action
  public fetchFollowing!: ({ url, add }: FetchFollowParam) => void;

  get query() {
    return this.getQuery;
  }

  set query(value: string) {
    this.queryAction(value);
  }

  public setfollowersOrFollowing(
    isFollowerActive: boolean,
    isFollowingActive: boolean
  ): void {
    this.isFollowerActive = isFollowerActive;
    this.isFollowingActive = isFollowingActive;
  }

  public getName(actor: ActivityObject | Link | URL): string | undefined {
    return ActivityObjectHelper.extractActorName(actor);
  }

  public getIcon(actor: ActivityObject | Link | URL): string | undefined {
    const originalIconUri = ActivityObjectHelper.extractIcon(
      actor as ActivityObject
    );

    return client.getMedia(originalIconUri);
  }

  public nextFollowersPage(): void {
    this.fetchFollowers({ url: this.getUser.followers, add: true });
  }

  public nextFollowingPage(): void {
    this.fetchFollowing({ url: this.getUser.following, add: true });
  }

  public detail(actor: User) {
    this.queryAction("");
    this.detailUser(actor);
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}

.follower-container {
  height: 100%;
  overflow: scroll;
}

h2 {
  margin-block-start: 0;
  margin-block-end: 0;
}

.action-all {
  padding-left: 32px;
}
</style>

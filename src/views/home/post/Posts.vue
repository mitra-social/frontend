<template>
  <div class="post-layout">
    <div id="scroll-target" class="post-container" v-if="getPosts">
      <div v-if="getPosts.length > 0">
        <div v-for="(post, index) in getPosts" :key="index">
          <Post
            :post="post"
            v-intersect="onIntersect"
            :postIndex="index"
            :data-index="index"
          />
        </div>
      </div>
      <div v-if="getPosts.length < 1 && !getLoadMorePostState">
        <v-card class="post">
          <v-card-title>
            <v-icon class="search-user-icon">mdi-account-search-outline</v-icon>
          </v-card-title>
          <v-card-text>
            <v-alert
              class="mt-1"
              border="bottom"
              colored-border
              type="info"
              elevation="2"
              icon="mdi-post-outline"
            >
              You haven't got any posts yet because you're not following anyone.
              Look for someone you can follow and enjoy reading.
            </v-alert>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <v-progress-linear
      :light="$vuetify.theme.dark"
      :dark="!$vuetify.theme.dark"
      :active="getLoadMorePostState"
      class="mx-1"
      indeterminate
      height="15"
      absolute
      bottom
    >
      <template v-slot>
        <strong class="caption">loading more...</strong>
      </template></v-progress-linear
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import router from "@/router";
import { namespace } from "vuex-class";
import { ActivityObject, Link } from "activitypub-objects";

import Post from "@/views/home/post/Post.vue";
import { AuthenticationUtil } from "@/utils/authentication-util";
import { User } from "@/model/user";

const userStore = namespace("User");
const collectionStore = namespace("Collection");
const notifyStore = namespace("Notify");

@Component({
  components: {
    Post,
  },
})
export default class MitraPosts extends Vue {
  @Watch("getPosts")
  private watchGetPosts(): void {
    if (document.getElementById("scroll-target")) {
      this.$vuetify.goTo("#scroll-target");
    }
  }

  @userStore.Getter
  public getUser!: User;

  @collectionStore.Getter
  public getPosts!: (ActivityObject | Link)[];

  @collectionStore.Getter
  public hasNextPage!: boolean;

  @collectionStore.Getter
  public getLoadMorePostState!: boolean;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;

  @collectionStore.Action
  public nextCollectionPage!: (user: string) => Promise<void>;

  @notifyStore.Action
  public error!: (message: string) => void;

  private created(): void {
    this.initGetUser();
  }

  private initGetUser(): void {
    if (this.getUser) {
      this.fetchCollection(this.getUser.preferredUsername);
    } else {
      AuthenticationUtil.clear();
      this.error("Authentication is incorrect");
      router.push({ name: "Login" });
    }
  }

  public onIntersect(entries: IntersectionObserverEntry[]): void {
    if (this.hasNextPage && entries[0].isIntersecting) {
      const target: Element = entries[0].target as Element;
      const index: number = +(target.getAttribute("data-index") ?? 0);

      if (index > this.getPosts.length - 3 && !this.getLoadMorePostState) {
        this.nextCollectionPage(this.getUser.preferredUsername);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-layout {
  position: relative;
  height: 100%;
}

.post-container {
  height: 100%;
  overflow-y: scroll;
}
</style>

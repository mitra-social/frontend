<template>
  <div class="post-container" v-if="getPosts">
    <div v-for="(post, index) in getPosts" :key="index">
      <v-card class="post">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">{{
              post.name ? post.name : post.summary | stripHtmlTags
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-4"></v-divider>
        <v-card-text>
          <component :is="getComponent(post.type)" :data="post" />
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <ActorPin
            v-if="post.attributedTo"
            :attributedTo="post.attributedTo"
          />
          <v-spacer></v-spacer>
          <v-btn icon disabled> <v-icon>mdi-comment-outline</v-icon> </v-btn>
          <v-btn icon disabled>
            <v-icon>mdi-heart-circle-outline</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import router from "@/router";
import { ActivityObject, Link } from "activitypub-objects";
import striptags from "striptags";

import { AuthenticationUtil } from "@/utils/authentication-util";
import { PostTypes } from "@/utils/post-types";
import ActorPin from "@/components/actor/ActorPin.vue";
import ActivityStreamsArticle from "./ActivityStreamsArticle.vue";

const collectionStore = namespace("Collection");

@Component({
  components: {
    ActorPin,
    ActivityStreamsArticle
  },
  filters: {
    stripHtmlTags(value: string) {
      return striptags(value);
    }
  }
})
export default class MitraPosts extends Vue {
  @collectionStore.Getter
  public getPosts!: Array<ActivityObject | Link>;

  @collectionStore.Action
  public fetchCollection!: (user: string) => Promise<void>;

  private created() {
    const user = AuthenticationUtil.getUser();

    if (user) {
      this.fetchCollection(user).catch(() => {
        this.notAllowedUser();
      });
    } else {
      this.notAllowedUser();
    }
  }

  private getComponent(type: string) {
    return PostTypes[type as keyof typeof PostTypes];
  }

  private notAllowedUser() {
    AuthenticationUtil.clear();
    router.push("/login");
    this.$toast.error("Authentication is incorrect");
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  height: 100%;
  overflow-y: scroll;
}

.post {
  margin: 5px;
}

.v-card__text {
  width: inherit;
}
</style>

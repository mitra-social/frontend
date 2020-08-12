<template>
  <v-card class="post" v-if="post">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline" v-if="post.name || post.summary">{{
          post.name ? post.name : post.summary | stripHtmlTags
        }}</v-list-item-title>
        <v-list-item-subtitle>
          <div class="d-flex flex-row justify-space-between">
            <ActorPin v-if="post.attributedTo" :actor="post.attributedTo" />
            <Date
              v-if="post.published"
              icon="mdi-publish"
              :date="post.published"
            />
            <Date v-if="post.updated" icon="mdi-update" :date="post.updated" />
          </div>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>
      <component :is="getComponent(post.type)" :data="post" />
      <Attachments
        v-if="
          post.attachment &&
          ((Array.isArray(post.attachment) && post.attachment.length > 0) ||
            !Array.isArray(post.attachment))
        "
        :attachments="post.attachment"
      />
    </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="blue lighten-1"
        :disabled="!post.inReplyTo"
        @click="isCommentOpen = !isCommentOpen"
      >
        <v-icon>mdi-comment-outline</v-icon>
      </v-btn>
      <v-btn icon disabled>
        <v-icon>mdi-heart-circle-outline</v-icon>
      </v-btn>
    </v-card-actions>
    <div class="pa-1" v-show="isCommentOpen">
      <Post :post="post.inReplyTo" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link } from "activitypub-objects";
import striptags from "striptags";

import ActivityStreamsArticleType from "@/views/home/post/text-type/ActivityStreamsArticleType.vue";
import ActivityStreamsNoteType from "@/views/home/post/text-type/ActivityStreamsNoteType.vue";
import Attachments from "@/views/home/post/attachments/index.vue";
import ActorPin from "@/components/actor/ActorPin.vue";
import Date from "@/components/ui/Date.vue";
import { PostTypes } from "@/utils/post-types";

@Component({
  components: {
    Attachments,
    ActorPin,
    Date,
    ActivityStreamsArticleType,
    ActivityStreamsNoteType,
  },
  filters: {
    stripHtmlTags(value: string) {
      return striptags(value);
    },
  },
})
export default class Post extends Vue {
  private isCommentOpen = false;
  @Prop() post!: ActivityObject | Link;

  private getComponent(type: string): PostTypes {
    return PostTypes[type as keyof typeof PostTypes];
  }
}
</script>

<style lang="scss" scoped>
.post {
  margin: 5px;
}

.search-user-icon.v-icon.v-icon {
  margin: auto;
  font-size: 100px;
}

.v-card__text {
  width: inherit;
}
</style>

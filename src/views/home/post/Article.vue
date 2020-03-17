<template>
  <v-card class="post">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="headline">{{
          article.name
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider class="mx-4"></v-divider>
    <v-card-text v-html="article.content"> </v-card-text>
    <v-divider class="mx-4"></v-divider>
    <v-card-actions>
      <v-list-item-avatar>
        <v-img :src="article.actor.avater"></v-img>
      </v-list-item-avatar>
      {{ article.actor.name }}
      <v-spacer></v-spacer>
      <v-btn icon disabled> <v-icon>mdi-comment-outline</v-icon> </v-btn>
      <v-btn icon disabled>
        <v-icon>mdi-heart-circle-outline</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { Article } from "../../../model/article";

@Component
export default class MitraArticle extends Vue {
  @Prop() private article!: Article;
}
</script>
<style lang="scss" scoped>
.post {
  margin: 5px;
}

.v-card__text {
  width: inherit;
}
</style>

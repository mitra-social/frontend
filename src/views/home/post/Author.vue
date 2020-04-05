<template>
  <div>
    <v-list-item-avatar v-if="icon">
      <v-img :src="icon"></v-img>
    </v-list-item-avatar>
    <v-list-item-avatar v-else color="indigo">
      <v-icon dark>mdi-account-circle</v-icon>
    </v-list-item-avatar>
    {{ author }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ActivityObject, Link, Image } from "activitypub-objects";

import { ObjectHelper } from "@/utils/object-helper";
import { RDF } from "@/model/rdf";

@Component
export default class MitraPosts extends Vue {
  @Prop() readonly attributedTo!:
    | ActivityObject
    | Link
    | URL
    | Array<ActivityObject | URL>;

  get author(): string | undefined {
    const lang = navigator.language;
    if (ObjectHelper.hasProperty(this.attributedTo, "name")) {
      return (this.attributedTo as ActivityObject).name;
    } else if (ObjectHelper.hasProperty(this.attributedTo, "nameMap")) {
      return (this.attributedTo as RDF).nameMap[lang];
    }
    return undefined;
  }

  get icon(): string | undefined {
    if (ObjectHelper.hasProperty(this.attributedTo, "icon")) {
      const icon = (this.attributedTo as ActivityObject).icon;

      if (icon) {
        if (ObjectHelper.hasProperty(icon, "href")) {
          return (icon as Link).href.toString();
        } else if (ObjectHelper.hasProperty(icon, "url")) {
          return (icon as Image).url.toString();
        }
      }
    }
    return undefined;
  }
}
</script>

<style lang="scss" scoped></style>

import { Component, Vue, Prop } from "vue-property-decorator";
import { Article } from "activitypub-objects";

@Component({
  provide() {
    return { child: this };
  },
  components: {
    TextType: {
      inject: ["child"],
      template:
        '<div v-if="child.data"><div v-html="child.data.content"></div></div>'
    }
  }
})
class ActivityStreamsTextTypeMixin extends Vue {
  @Prop() private data!: Article;
}

export default ActivityStreamsTextTypeMixin;

import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { DialogSettings } from "@/model/dialog-settings";

@Module({ namespaced: true })
class DialogStore extends VuexModule {
  private isOpen = false;
  private title: string | undefined = undefined;
  private component: string | undefined = undefined;

  get getIsOpen(): boolean {
    return this.isOpen;
  }

  get getTitle(): string | undefined {
    return this.title;
  }

  get getComponent(): string | undefined {
    return this.component;
  }

  @Mutation
  public setIsOpen(openState: boolean): void {
    this.isOpen = openState;
  }

  @Mutation
  public setTitle(title: string | undefined): void {
    this.title = title;
  }

  @Mutation
  public setComponent(component: string): void {
    this.component = component;
  }

  @Action
  public toggleDialog({ title, component }: DialogSettings): void {
    const isOpen = !this.isOpen;

    if (isOpen) {
      this.context.commit("setTitle", title);
      this.context.commit("setComponent", component);
    } else {
      this.context.commit("setTitle", undefined);
      this.context.commit("setComponent", undefined);
    }
    this.context.commit("setIsOpen", isOpen);
  }
}
export default DialogStore;

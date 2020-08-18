import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { DialogSettings } from "@/model/dialog-settings";

@Module({ namespaced: true })
class DialogStore extends VuexModule {
  private isOpen = false;
  private title: string | undefined = undefined;
  private component: string | undefined = undefined;
  private isFullsize = false;

  get getIsOpen(): boolean {
    return this.isOpen;
  }

  get getTitle(): string | undefined {
    return this.title;
  }

  get getComponent(): string | undefined {
    return this.component;
  }

  get getIsFullsize(): boolean {
    return this.isFullsize;
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

  @Mutation
  public setIsFullsize(isFullsize: boolean): void {
    this.isFullsize = isFullsize;
  }

  @Action
  public toggleDialog({ title, component, isFullsize }: DialogSettings): void {
    const isOpen = !this.isOpen;

    if (isOpen) {
      this.context.commit("setTitle", title);
      this.context.commit("setComponent", component);
      this.context.commit("setIsFullsize", isFullsize);
    } else {
      this.context.commit("setTitle", undefined);
      this.context.commit("setComponent", undefined);
      this.context.commit("setIsFullsize", false);
    }
    this.context.commit("setIsOpen", isOpen);
  }
}
export default DialogStore;

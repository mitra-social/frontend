import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import { Attachment } from "@/model/attachment";
import { SelectedAttachmentParam } from "@/model/selected-attachment-param";
import { AddAttachmentsParam } from "@/model/add-attachments-param";

@Module({ namespaced: true })
class DialogAttachmentsStore extends VuexModule {
  private indexSelectedAttachment = 0;
  private indexSelectedAttachments = 0;
  private attachments: Map<number, Attachment[]> = new Map();

  get getSelectedAttachmentIndex(): number {
    return this.indexSelectedAttachment;
  }

  get getSelectedAttachments(): Attachment[] | undefined {
    return this.attachments.get(this.indexSelectedAttachments);
  }

  @Mutation
  public setSelectedAttachment(index: number): void {
    this.indexSelectedAttachment = index;
  }

  @Mutation
  public setSelectedAttachments(index: number): void {
    this.indexSelectedAttachments = index;
  }

  @Mutation
  public setAttachments(map: Map<number, Attachment[]>): void {
    this.attachments = map;
  }

  @Mutation
  public addAttachments({ index, attachments }: AddAttachmentsParam): void {
    this.attachments.set(index, attachments);
  }

  @Action
  public async setSelectedAttachmentAction({
    postIndex,
    attachIndex,
  }: SelectedAttachmentParam): Promise<void> {
    this.context.commit("setSelectedAttachments", postIndex);
    this.context.commit("setSelectedAttachment", attachIndex);
  }

  @Action
  public async setSelectedPostAttachments(index: number): Promise<void> {
    this.context.commit("setSelectedAttachments", index);
  }

  @Action
  public addAttachmentsAction(attachments: AddAttachmentsParam): void {
    this.context.commit("addAttachments", attachments);
  }

  @Action
  public reset(): void {
    this.context.commit("setSelectedAttachment", 0);
    this.context.commit("setSelectedAttachments", 0);
    this.context.commit("setAttachments", new Map());
  }
}
export default DialogAttachmentsStore;
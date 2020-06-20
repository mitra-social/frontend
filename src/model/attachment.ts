export class Attachment {
  type?: string;
  url: string;

  constructor(url: string, type?: string) {
    this.url = url;
    this.type = type;
  }
}

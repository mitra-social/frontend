export interface Link {
  rel: string;
  type?: string;
  href: string;
  template?: string;
}

export interface Webfinger {
  subject: string;
  aliases: string[];
  links: Link[];
}

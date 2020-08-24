export interface Link {
  href: string;
  rel: string;
  template?: string;
  type?: string;
}

export interface Webfinger {
  aliases: string[];
  links: Link[];
  subject: string;
}

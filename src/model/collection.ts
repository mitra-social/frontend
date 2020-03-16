import { Post } from './post';

export interface Collection {
  summary: string;
  type: string;
  totalItems: number;
  items: Post[];
}
import { Article } from './article';

export interface Collection {
  summary: string;
  type: string;
  totalItems: number;
  items: Article[];
}
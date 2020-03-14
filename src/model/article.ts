import { Actor } from './actor';

export interface Article {
  type: string;
  name: string;
  content: string;
  actor: Actor;
}
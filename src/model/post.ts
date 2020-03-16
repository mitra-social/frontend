import { Actor } from './actor';

export interface Post {
  type: string;
  name: string;
  content: string;
  actor: Actor;
}
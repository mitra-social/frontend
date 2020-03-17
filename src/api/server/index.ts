import { ApiClient } from '../api-client';

import { Collection } from '@/model/collection';

export default {
  fetchPosts(): Promise<Collection>{
    console.warn("is not yet implemented");
    return new Promise(resolve => {
      resolve(undefined);
    });
  }
} as ApiClient;

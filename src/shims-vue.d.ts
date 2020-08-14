declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}

declare module "apiClient" {
  import { ApiClient } from "@/api-client";
  const value: ApiClient;
  export default value;
}

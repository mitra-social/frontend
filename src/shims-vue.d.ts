declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.json" {
  const value: { [key: string]: object };
  export default value;
}

declare module "apiClient" {
  import { ApiClient } from "@/api/api-client";
  const value: ApiClient;
  export default value;
}

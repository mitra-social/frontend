import { ApiClient } from "..";

export interface ApiClientMocke extends ApiClient {
  // eslint-disable-next-line
  getJestReset: any;
  getPassword(): string;
}

import { Environment } from ".";

export interface Config {
  clientId: string;
  env: Environment;
  secret: string;
}

import { launchServer } from "./link-server";

export type Environment = "production" | "sandbox" | "development";

export type Product =
  | "transactions"
  | "auth"
  | "balance"
  | "identity"
  | "investments"
  | "assets"
  | "liabilities"
  | "income"
  | string;

interface LinkOptions {
  env: Environment;
  products: Product[];
  publicKey: string;
  clientId: string;
  secret: string;
}

interface LinkResult {
  accessToken: string;
  itemId: string;
}

export async function link(options: LinkOptions): Promise<LinkResult> {
  const publicToken = await launchServer({
    countryCodes: ["US"],
    env: options.env,
    key: options.publicKey,
    product: options.products
  });

  // TODO: Implement
  console.log(publicToken);

  throw new Error("asdf");
}

interface LinkUpdateOptions extends LinkOptions {
  accessToken: string;
}

export function update(options: LinkUpdateOptions): Promise<void> {
  // TODO: Implement
  throw new Error("asdf");
}

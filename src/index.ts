import { launchPlaidLink } from "./link-server";
import plaid from "plaid";

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

function makePlaidClient(options: LinkOptions): plaid.Client {
  return new plaid.Client(
    options.clientId,
    options.secret,
    options.publicKey,
    plaid.environments[options.env],
    {
      version: "2019-05-29"
    }
  );
}

export async function link(options: LinkOptions): Promise<LinkResult> {
  const publicToken = await launchPlaidLink({
    countryCodes: ["US"],
    env: options.env,
    key: options.publicKey,
    product: options.products
  });

  const client = makePlaidClient(options);
  const response = await client.exchangePublicToken(publicToken);

  return {
    itemId: response.item_id,
    accessToken: response.access_token
  };
}

interface LinkUpdateOptions extends LinkOptions {
  accessToken: string;
}

export async function update(options: LinkUpdateOptions): Promise<void> {
  const client = makePlaidClient(options);
  const response = await client.createPublicToken(options.accessToken);

  await launchPlaidLink({
    countryCodes: ["US"],
    env: options.env,
    key: options.publicKey,
    product: options.products,
    token: response.public_token
  });
}

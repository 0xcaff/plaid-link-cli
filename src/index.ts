import { launchPlaidLink } from "./link-server";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products
} from "plaid";
import { v4 as uuid } from "uuid";

export type Environment = "production" | "sandbox" | "development";

interface LinkOptions {
  env: Environment;
  products: Products[];
  clientId: string;
  secret: string;
}

interface LinkResult {
  accessToken: string;
  itemId: string;
}

function makePlaidClient(options: LinkOptions): PlaidApi {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[options.env],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": options.clientId,
        "PLAID-SECRET": options.secret
      }
    }
  });

  return new PlaidApi(configuration);
}

export async function link(options: LinkOptions): Promise<LinkResult> {
  const userId = uuid();
  console.log({ userId });

  const client = makePlaidClient(options);
  const tokenCreateResponse = await client.linkTokenCreate({
    client_name: "Plaid Link CLI",
    language: "en",
    country_codes: [CountryCode.Us],
    user: {
      client_user_id: userId
    },
    products: options.products as any
  });

  const linkToken = tokenCreateResponse.data.link_token;

  const publicToken = await launchPlaidLink({
    countryCodes: ["US"],
    env: options.env,
    product: options.products,
    token: linkToken
  });

  const response = await client.itemPublicTokenExchange({
    public_token: publicToken
  });

  return {
    itemId: response.data.item_id,
    accessToken: response.data.access_token
  };
}

interface LinkUpdateOptions extends LinkOptions {
  accessToken: string;
}

export async function update(options: LinkUpdateOptions): Promise<void> {
  const userId = uuid();
  console.log({ userId });

  const client = makePlaidClient(options);
  const response = await client.linkTokenCreate({
    access_token: options.accessToken,

    client_name: "Plaid Link CLI",
    language: "en",
    country_codes: [CountryCode.Us],
    user: {
      client_user_id: userId
    },
    products: options.products
  });

  await launchPlaidLink({
    countryCodes: ["US"],
    env: options.env,
    product: options.products,
    token: response.data.link_token
  });
}

import { Environment } from ".";
import { Server } from "http";
import { default as micro, text, send } from "micro";
import * as ejs from "ejs";
import { AddressInfo } from "net";
import open from "open";
import path from "path";
import {Products} from "plaid";

const linkTemplatePath = path.join(__dirname, "./link.ejs");

export interface LinkServerOptions {
  env: Environment;
  product: Products[];
  key: string;
  countryCodes: string[];
  link_token: string;
  token?: string;
}

function makeServer(
  options: LinkServerOptions,
  callback: (publicToken: string) => void
): Server {
  return micro(async (req, resp) => {
    const method = (req.method || "").toUpperCase();
    if (method === "GET") {
      const rendered = await ejs.renderFile(linkTemplatePath, { options });
      await send(resp, 200, rendered);
    } else if (method === "POST") {
      const publicToken = await text(req);

      await send(resp, 200);

      callback(publicToken);
    } else {
      await send(resp, 404);
    }
  }) as any;
}

export function launchPlaidLink(options: LinkServerOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = makeServer(options, (publicToken) => {
      server.close(reject);

      resolve(publicToken);
    });

    server.listen(0, "localhost", () => {
      const port = (server.address() as AddressInfo).port;
      open(`http://localhost:${port}`);
    });
  });
}

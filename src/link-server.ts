import { Environment, Product } from ".";
import { Server } from "http";
import { default as micro, text, send } from "micro";
import * as ejs from "ejs";
import { AddressInfo } from "net";
import open from "open";
import { fileURLToPath } from "url";
import path from "path";

const linkTemplatePath = path.join(__dirname, "./link.ejs");

export interface LinkServerOptions {
  env: Environment;
  product: Product[];
  key: string;
  countryCodes: string[];
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
  });
}

export function launchServer(options: LinkServerOptions) {
  return new Promise(resolve => {
    const server = makeServer(options, resolve);

    server.listen(0, "localhost", () => {
      const port = (server.address() as AddressInfo).port;
      open(`http://localhost:${port}`);
    });
  });
}

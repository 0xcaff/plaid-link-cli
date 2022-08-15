import { link, update } from ".";
import * as fs from "fs";
import { Config } from "./config";
import program from "commander";
import { Products } from "plaid";

const configFile = fs.readFileSync("./plaid.config.json");
const configString = configFile.toString("utf-8");
const config = JSON.parse(configString) as Config;

program
  .command("link")
  .description("Link an account with Plaid")
  .option(
    "--products <items>",
    "products to authenticate for",
    items => items.split(","),
    ["transactions"]
  )
  .action(async args => {
    const products = args.products as Products[];

    const result = await link({ ...config, products });
    console.log(result);
  });

program
  .command("update <accessToken>")
  .description("Update an existing Plaid account")
  .option(
    "--products <items>",
    "products to authenticate for",
    items => items.split(","),
    ["transactions"]
  )
  .action(async (accessToken, args) => {
    const products = args.products as Products[];

    const result = await update({ ...config, accessToken, products });
    console.log(result);
  });

program.parse(process.argv);

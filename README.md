# plaid-link-cli

Library and CLI to interactively authenticate with Plaid. Also supports
updating existing Plaid Items.

## Usage

Create a `plaid.config.json` file with the following information:

```json
{
  "clientId": "...",
  "env": "development",
  "publicKey": "...",
  "secret": "..."
}
```

Now, run `plaid-link --help` from that folder to see available options.

```
Usage: plaid-link [options] [command]

Options:
  -h, --help                      output usage information

Commands:
  link [options]                  Link an account with Plaid
  update [options] <accessToken>  Update an existing Plaid account
```

# Env Replace Action

Changes the file during build (useful for replacing environment variables in a file)

```yaml
# Initial .env file:
# API_URL=https://api.example.com
# API_KEY=123456
uses: Langsdorf/env-replace@v1.2.7
with:
  key: "API_URL"
  value: "https://api.staging.example.com"
# Resulting .env file:
# API_URL=https://api.staging.example
# API_KEY=123456
```

## Inputs

#### `key`

The key to replace

#### `value`

The value to replace

#### `file`

The file to replace the key/value in. Default `"./.env"`

#### `output`

The file to output the new contents to. Default `"./.env"`

#### `replace-all`

List of secrets to replace.

Warning: This is useful for replacing multiple keys at once, but be careful not to replace keys that shouldn't be replaced.

#### `upsert`

If true, will add the key/value if it doesn't exist. Default `false`
Note: This only works if `replace-all` is used.

#### `remove-non-matches`

If true, will remove any keys that aren't in the `replace-all` list. Default `false`
Note: This only works if `replace-all` is used.

## Outputs

#### `result`

The new file contents

## Example usage

#### With key and value

```yaml
uses: Langsdorf/env-replace@v1.2.7
with:
  key: "API_URL"
  value: "https://api.example.com"
```

#### With replace-all

```yaml
uses: Langsdorf/env-replace@v1.2.7
with:
  replace-all: |
    API_URL=https://api.example.com
    API_KEY=123456
    SECRET_VALUE=${{ secrets.SECRET_VALUE }}
  upsert: true
  remove-non-matches: true
```

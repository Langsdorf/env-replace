# Env Replace Action

Changes the file during build (useful for replacing environment variables in a file)

## Inputs

### `key`

The key to replace

### `value`

The value to replace

### `file`

The file to replace the key/value in. Default `"./.env"`

### `replace-all`

List of secrets to replace.

Warning: This is useful for replacing multiple keys at once, but be careful not to replace keys that should not be replaced.

## Example usage

### With key and value

```yaml
uses: Langsdorf/env-replace@v1.0.6
with:
  key: "API_URL"
  value: "https://api.example.com"
```

### With secrets

```yaml
uses: Langsdorf/env-replace@v1.0.6
with:
  replace-all: |
    API_URL=https://api.example.com
    API_KEY=123456
    SECRET_VALUE=${{ secrets.SECRET_VALUE }}
```

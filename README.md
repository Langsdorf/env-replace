# Env Replace Action

Changes the file during build (useful for replacing environment variables in a file)

## Inputs

### `key`

The key to replace

### `value`

The value to replace

### `file`

The file to replace the key/value in. Default `"./.env"`

### `secrets`

List of secrets to replace.

### `match-secrets`

"true" | "false" - Determines if secrets should be matched. Default `"false"`

Warning: This will replace all keys specified in the secrets list with the value of the secret. This is useful for replacing multiple keys at once, but be careful not to replace keys that should not be replaced.

## Example usage

### With key and value

```yaml
uses: Langsdorf/env-replace@v1.0.5
with:
  key: "API_URL"
  value: "https://api.example.com"
```

### With secrets

```yaml
uses: Langsdorf/env-replace@v1.0.5
with:
  match-secrets: "true"
  secrets: |
    API_URL=https://api.example.com
    API_KEY=123456
    SECRET_VALUE=${{ secrets.SECRET_VALUE }}
```

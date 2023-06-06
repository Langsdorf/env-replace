# Env Replace Action

Changes the file during build (useful for replacing environment variables in a file)

## Inputs

### `key`

**Required** The key to replace

### `value`

**Required** The value to replace

### `file`

The file to replace the key/value in. Default `"./.env"`

## Example usage

```yaml
uses: Langsdorf/env-replace@v1.0.0
with:
  key: 'API_URL'
  value: 'https://api.example.com'
```
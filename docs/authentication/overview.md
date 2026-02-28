---
sidebar_position: 1
title: Authentication Overview
description: Learn how Payzink API authentication works.
---

# Authentication

Payzink uses **Bearer token authentication**. Every request to the Payzink Merchant API must include a valid access token in the `Authorization` header.

## How it works

1. Your server sends the `publishableKey` and `secretKey` to the auth endpoint.
2. Payzink returns a short-lived access token (JWT) inside a `result` object.
3. Your server includes the token in the `Authorization` header of subsequent API requests.
4. Payzink validates the token and processes the request.

## Credentials

You get two keys from the Payzink dashboard:

| Key | Format | Purpose |
|-----|--------|---------|
| **Publishable Key** | `pk_live_...` / `pk_test_...` | Identifies your merchant account. |
| **Secret Key** | `sk_live_...` / `sk_test_...` | Authenticates your API requests. Must be kept secret. |

## Token lifecycle

| Property | Value |
|----------|-------|
| Token type | JWT (JSON Web Token) |
| Expires in | **300 seconds** (5 minutes) |
| Refresh mechanism | Request a new token before the current one expires |

:::warning Token expiry
Access tokens are short-lived. Handle `401 Unauthorized` responses by obtaining a fresh token and retrying the request.
:::

## Authentication headers

All authenticated API requests must include:

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes (for POST/PUT/DELETE) |

## Example token caching strategy

```javascript
class PayzinkAuth {
  constructor(publishableKey, secretKey) {
    this.publishableKey = publishableKey;
    this.secretKey = secretKey;
    this.token = null;
    this.expiresAt = 0;
  }

  async getToken() {
    if (this.token && Date.now() < this.expiresAt - 30000) {
      return this.token;
    }

    const response = await fetch(
      "https://merchant-dev.payzink.com/api/v1/auth/access-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishableKey: this.publishableKey,
          secretKey: this.secretKey,
        }),
      }
    );

    const { result } = await response.json();
    this.token = result.accessToken;
    this.expiresAt = Date.now() + result.expiresIn * 1000;
    return this.token;
  }
}
```

## Security best practices

1. **Never expose `secretKey` client-side.** Only use it in server-to-server communication.
2. **Rotate credentials periodically.** Generate new keys from the dashboard.
3. **Cache tokens.** Don't request a new token for every API call.
4. **Use environment variables.** Store keys in environment variables, not in code.

## Next steps

- **[Request an Access Token](/authentication/access-token)** — Full endpoint reference with code examples.

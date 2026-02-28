---
sidebar_position: 2
title: Request an Access Token
description: API reference for obtaining an access token from Payzink.
---

# Request an Access Token

<span class="badge badge--post">POST</span> `/api/v1/auth/access-token`

Exchange your merchant API credentials for a short-lived access token.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/auth/access-token` |
| Production | `https://merchant.payzink.com/api/v1/auth/access-token` |

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `publishableKey` | `string` | Yes | Your publishable (public) key from the Payzink dashboard. |
| `secretKey` | `string` | Yes | Your secret key from the Payzink dashboard. |

### Example request

```json
{
  "publishableKey": "pk_live_xxxxxxxxxxxx",
  "secretKey": "sk_live_xxxxxxxxxxxx"
}
```

## Response

### Success — `200 OK`

All Payzink API responses are wrapped in a `result` object.

```json
{
  "result": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "bearer",
    "expiresIn": 300
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `result.accessToken` | `string` | The JWT access token to use in subsequent API calls. |
| `result.tokenType` | `string` | Always `"bearer"`. |
| `result.expiresIn` | `integer` | Token lifetime in seconds (typically `300`). |

### Error — `401 Unauthorized`

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The publishable key or secret key provided is invalid."
  }
}
```

## Code examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/auth/access-token \
  -H "Content-Type: application/json" \
  -d '{
    "publishableKey": "pk_live_xxxxxxxxxxxx",
    "secretKey": "sk_live_xxxxxxxxxxxx"
  }'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
  "https://merchant-dev.payzink.com/api/v1/auth/access-token",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      publishableKey: "pk_live_xxxxxxxxxxxx",
      secretKey: "sk_live_xxxxxxxxxxxx",
    }),
  }
);

const { result } = await response.json();
const accessToken = result.accessToken;
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://merchant-dev.payzink.com/api/v1/auth/access-token');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode([
        'publishableKey' => 'pk_live_xxxxxxxxxxxx',
        'secretKey' => 'sk_live_xxxxxxxxxxxx',
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$accessToken = $data['result']['accessToken'];
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://merchant-dev.payzink.com/api/v1/auth/access-token",
    json={
        "publishableKey": "pk_live_xxxxxxxxxxxx",
        "secretKey": "sk_live_xxxxxxxxxxxx",
    },
)

data = response.json()
access_token = data["result"]["accessToken"]
```

</TabItem>
</Tabs>

## Rate limits

| Limit | Value |
|-------|-------|
| Requests per minute | 60 |
| Requests per hour | 500 |

## Next steps

- **[Hosted Payment Page](/hosted-payment-page/overview)** — Use your token to create hosted payments.
- **[Direct API](/direct-api/overview)** — Use your token to process card payments directly.

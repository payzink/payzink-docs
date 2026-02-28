---
sidebar_position: 3
title: Create a Hosted Payment
description: API reference for creating a hosted payment via the Payzink HPP.
---

# Create a Hosted Payment

<span class="badge badge--post">POST</span> `/api/v1/payment/hosted`

Create a new hosted payment. Payzink returns a checkout URL where you redirect the customer.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/hosted` |
| Production | `https://merchant.payzink.com/api/v1/payment/hosted` |

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `order` | `object` | Yes | Order details. |
| `order.action` | `string` | Yes | `PURCHASE` for immediate charge, `AUTHORIZE` for pre-authorization. |
| `order.amount` | `object` | Yes | Payment amount. |
| `order.amount.currencyCode` | `string` | Yes | ISO 4217 currency code (e.g., `AED`, `USD`, `EUR`). |
| `order.amount.value` | `integer` | Yes | Amount in minor units (e.g., `5000` = 50.00). |
| `customer` | `object` | No | Customer details. |
| `customer.email` | `string` | No | Customer's email address. |
| `extra` | `object` | No | Custom key-value pairs for your internal use. Stored with the transaction. |
| `_links` | `object` | No | Callback and notification URLs. |
| `_links.notificationUrl` | `string` | No | Webhook URL to receive payment notifications. |

### Example request

```json
{
  "order": {
    "action": "PURCHASE",
    "amount": {
      "currencyCode": "USD",
      "value": 2500
    }
  },
  "customer": {
    "email": "customer@example.com"
  },
  "extra": {
    "orderId": "MY-ORDER-001",
    "customField": "any-value"
  },
  "_links": {
    "notificationUrl": "https://yoursite.com/webhooks/payzink"
  }
}
```

## Response

### Success — `200 OK`

```json
{
  "meta": {
    "requestId": "payzink-REQ-cbc39185-c4d0-4c5f-8c09-324e5f4ffa89"
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "mid": 1,
    "state": "STARTED",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "USD",
        "value": 2500
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      },
      "payment": {
        "href": "https://payment-dev.payzink.com/checkout/02204c33-a250-45f2-ac73-3714acd6cbb1"
      }
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `meta.requestId` | `string` | Unique identifier for this API request. |
| `result.reference` | `string` | Unique transaction reference (UUID). Use this to check status. |
| `result.mid` | `integer` | Merchant ID. |
| `result.state` | `string` | Initial state. Always `STARTED`. |
| `result.merchantName` | `string` | Your registered merchant name. |
| `result.order` | `object` | Echo of the order details. |
| `result._links.self.href` | `string` | URL to retrieve transaction info. |
| `result._links.payment.href` | `string` | **Checkout URL** — redirect the customer here. |

### Error — `400 Bad Request`

```json
{
  "meta": {
    "requestId": "payzink-REQ-..."
  },
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount value must be greater than zero."
  }
}
```

## Code examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/hosted \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "USD",
        "value": 2500
      }
    },
    "customer": {
      "email": "customer@example.com"
    },
    "_links": {
      "notificationUrl": "https://yoursite.com/webhooks/payzink"
    }
  }'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
  "https://merchant-dev.payzink.com/api/v1/payment/hosted",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      order: {
        action: "PURCHASE",
        amount: { currencyCode: "USD", value: 2500 },
      },
      customer: { email: "customer@example.com" },
      _links: { notificationUrl: "https://yoursite.com/webhooks/payzink" },
    }),
  }
);

const { result } = await response.json();
const checkoutUrl = result._links.payment.href;
console.log("Redirect to:", checkoutUrl);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://merchant-dev.payzink.com/api/v1/payment/hosted');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $accessToken,
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'order' => [
            'action' => 'PURCHASE',
            'amount' => ['currencyCode' => 'USD', 'value' => 2500],
        ],
        'customer' => ['email' => 'customer@example.com'],
        '_links' => ['notificationUrl' => 'https://yoursite.com/webhooks/payzink'],
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);

$checkoutUrl = $data['result']['_links']['payment']['href'];
header('Location: ' . $checkoutUrl);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://merchant-dev.payzink.com/api/v1/payment/hosted",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    },
    json={
        "order": {
            "action": "PURCHASE",
            "amount": {"currencyCode": "USD", "value": 2500},
        },
        "customer": {"email": "customer@example.com"},
        "_links": {"notificationUrl": "https://yoursite.com/webhooks/payzink"},
    },
)

result = response.json()["result"]
checkout_url = result["_links"]["payment"]["href"]
print(f"Redirect to: {checkout_url}")
```

</TabItem>
</Tabs>

## Next steps

- **[Request Payment from Customer](/hosted-payment-page/request-payment)** — Learn about the redirect flow.
- **[Retrieve Transaction Info](/hosted-payment-page/retrieve-transaction)** — Verify payment results.

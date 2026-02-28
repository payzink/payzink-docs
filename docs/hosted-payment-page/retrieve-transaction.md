---
sidebar_position: 5
title: Retrieve Transaction Info
description: Verify payment status after checkout.
---

# Retrieve Transaction Info

<span class="badge badge--get">GET</span> `/api/v1/payment/transaction/{reference}/info`

After a customer completes the hosted checkout, call this endpoint to verify the payment result. You can use the `_links.self.href` URL from the hosted payment response.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/info` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/info` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference returned from the hosted payment response. |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |

No request body.

## Response

### Success — Purchase completed

```json
{
  "meta": {
    "requestId": "payzink-REQ-abc12345-6789-0abc-def0-123456789abc"
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "paymentDetail": {
      "pan": "4111********1111",
      "expiryMonth": "***",
      "expiryYear": "2027",
      "cvv": "***",
      "brand": "VISA",
      "cardHolderName": "John Doe"
    },
    "mid": 1,
    "state": "PURCHASED",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      },
      "cancel": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/cancel"
      },
      "refund": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/refund"
      }
    }
  }
}
```

### Success — Authorized (pending capture)

```json
{
  "meta": {
    "requestId": "payzink-REQ-..."
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "paymentDetail": {
      "pan": "5200********0007",
      "expiryMonth": "***",
      "expiryYear": "2028",
      "cvv": "***",
      "brand": "MASTERCARD",
      "cardHolderName": "Jane Smith"
    },
    "mid": 1,
    "state": "AUTHORISED",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "AUTHORIZE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      },
      "capture": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/capture"
      },
      "cancel": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/cancel"
      }
    }
  }
}
```

### Payment failed

```json
{
  "meta": {
    "requestId": "payzink-REQ-..."
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "mid": 1,
    "state": "FAILED",
    "statusCode": "E000005",
    "statusMessage": "Error - Insufficient Funds",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      }
    }
  }
}
```

## Code examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X GET https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/info \
  -H "Authorization: Bearer {accessToken}"
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
  `https://merchant-dev.payzink.com/api/v1/payment/transaction/${reference}/info`,
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
);

const { result } = await response.json();

if (result.state === "PURCHASED" || result.state === "AUTHORISED") {
  console.log("Payment successful:", result.reference);
} else {
  console.log("Payment failed:", result.state, result.statusMessage);
}
```

</TabItem>
</Tabs>

## Next steps

- **[Payment States](/payment-lifecycle/payment-states)** — Understand all possible states.
- **[Capture a Payment](/direct-api/capture)** — Capture authorized payments.
- **[Webhooks](/webhooks/overview)** — Receive real-time notifications.

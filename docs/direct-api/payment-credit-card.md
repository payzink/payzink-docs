---
sidebar_position: 4
title: Payment with Credit Card
description: API reference for processing a credit card payment with the Direct API.
---

# Payment with Credit Card

<span class="badge badge--post">POST</span> `/api/v1/payment/card`

Process a credit or debit card payment. Supports both immediate purchase and pre-authorization.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/card` |
| Production | `https://merchant.payzink.com/api/v1/payment/card` |

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes |

### Body parameters

| Parameter | Type | Required | Description                                                                                       |
|-----------|------|----------|---------------------------------------------------------------------------------------------------|
| `reference` | `string` | No | An existing transaction reference from `/payment/init`. If omitted, a new transaction is created. |
| `order` | `object` | Yes | Order details.                                                                                    |
| `order.action` | `string` | Yes | `PURCHASE` (immediate charge) or `AUTH` (pre-auth).                                               |
| `order.amount` | `object` | Yes | Payment amount.                                                                                   |
| `order.amount.currencyCode` | `string` | Yes | ISO 4217 currency code (e.g., `EUR`, `USD`, `AED`).                                               |
| `order.amount.value` | `integer` | Yes | Amount in minor units (e.g., `5000` = 50.00).                                                     |
| `payment` | `object` | Yes | Card details.                                                                                     |
| `payment.pan` | `string` | Yes | Full card number (PAN), no spaces.                                                                |
| `payment.expiryYear` | `string` | Yes | Four-digit expiry year (e.g., `"2038"`).                                                          |
| `payment.expiryMonth` | `string` | Yes | Two-digit expiry month (e.g., `"05"`).                                                            |
| `payment.cvv` | `string` | Yes | 3-digit CVV (4 digits for AMEX).                                                                  |
| `payment.cardHolderName` | `string` | Yes | Name as printed on the card.                                                                      |
| `customer` | `object` | No | Customer details.                                                                                 |
| `customer.email` | `string` | No | Customer's email address.                                                                         |
| `customer.ip` | `string` | No | Customer's IP address (recommended for fraud prevention).                                         |
| `customer.phoneNumber` | `string` | No | Customer's phone number with country code.                                                        |
| `customer.zipCode` | `string` | No | Customer's postal/ZIP code.                                                                       |
| `extra` | `object` | No | Custom key-value pairs for your internal use.                                                     |
| `_links` | `object` | No | Callback and notification URLs.                                                                   |
| `_links.callbackUrl` | `string` | No | URL to redirect the customer after 3DS authentication.                                            |
| `_links.notificationUrl` | `string` | No | Webhook URL for payment notifications.                                                            |

### Example request — Purchase

```json
{
  "order": {
    "action": "PURCHASE",
    "amount": {
      "currencyCode": "EUR",
      "value": 5000
    }
  },
  "payment": {
    "pan": "4111111111111111",
    "expiryYear": "2038",
    "expiryMonth": "05",
    "cvv": "123",
    "cardHolderName": "John Doe"
  },
  "customer": {
    "email": "john@example.com",
    "ip": "81.214.125.134",
    "phoneNumber": "+905551234567",
    "zipCode": "34517"
  },
  "extra": {
    "orderId": "MY-ORDER-001"
  },
  "_links": {
    "callbackUrl": "https://yoursite.com/3ds-callback",
    "notificationUrl": "https://yoursite.com/webhooks/payzink"
  }
}
```

### Example request — Authorization

```json
{
  "order": {
    "action": "AUTH",
    "amount": {
      "currencyCode": "USD",
      "value": 15000
    }
  },
  "payment": {
    "pan": "5200000000000007",
    "expiryYear": "2028",
    "expiryMonth": "06",
    "cvv": "456",
    "cardHolderName": "Jane Smith"
  },
  "customer": {
    "email": "jane@example.com"
  },
  "_links": {
    "callbackUrl": "https://yoursite.com/3ds-callback"
  }
}
```

### Using existing reference from `/payment/init`

```json
{
  "reference": "5a12782e-d539-4479-b419-ef9b9d728b9a",
  "order": {
    "action": "PURCHASE",
    "amount": {
      "currencyCode": "EUR",
      "value": 5000
    }
  },
  "payment": {
    "pan": "4111111111111111",
    "expiryYear": "2038",
    "expiryMonth": "05",
    "cvv": "123",
    "cardHolderName": "John Doe"
  }
}
```

## Response

All responses include a `meta` object with a unique `requestId` and a `result` object.

### Success — Payment approved (no 3DS)

```json
{
  "meta": {
    "requestId": "payzink-REQ-520e2f44-d0ee-4b8f-bc2c-2f6ad0fcbbd9"
  },
  "result": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "paymentDetail": {
      "pan": "4741********2013",
      "expiryMonth": "***",
      "expiryYear": "2038",
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
        "currencyCode": "EUR",
        "value": 5000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/info"
      },
      "cancel": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/cancel"
      },
      "refund": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/refund"
      }
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `meta.requestId` | `string` | Unique API request identifier. |
| `result.reference` | `string` | Transaction reference (UUID). |
| `result.paymentDetail` | `object` | Masked card details. |
| `result.paymentDetail.pan` | `string` | Masked card number. |
| `result.paymentDetail.brand` | `string` | Card brand (`VISA`, `MASTERCARD`, `AMEX`). |
| `result.paymentDetail.cardHolderName` | `string` | Cardholder name. |
| `result.mid` | `integer` | Merchant ID. |
| `result.state` | `string` | Payment state (`PURCHASED`, `AUTHORISED`). |
| `result.merchantName` | `string` | Your registered merchant name. |
| `result.order` | `object` | Order details. |
| `result._links` | `object` | Available actions (HATEOAS links). |
| `result._links.self.href` | `string` | URL to retrieve transaction info. |
| `result._links.cancel.href` | `string` | URL to cancel/void this transaction. |
| `result._links.refund.href` | `string` | URL to refund this transaction. |

### Success — 3DS required

When `state` is `AWAIT_3DS`, redirect the customer to the 3DS page via `_links["payment:3ds"].href`:

```json
{
  "meta": {
    "requestId": "payzink-REQ-eca29fd6-7413-4e21-b3d2-a7d27eeb2e5a"
  },
  "result": {
    "reference": "1325ce74-4f82-4394-a25d-67a9333e5b24",
    "paymentDetail": {
      "pan": "4111********1111",
      "expiryMonth": "***",
      "expiryYear": "2038",
      "cvv": "***",
      "brand": "VISA",
      "cardHolderName": "John Doe"
    },
    "mid": 1,
    "state": "AWAIT_3DS",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "EUR",
        "value": 5000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/1325ce74-4f82-4394-a25d-67a9333e5b24/info"
      },
      "payment:3ds": {
        "href": "https://payment-dev.payzink.com/3ds/1325ce74-4f82-4394-a25d-67a9333e5b24"
      }
    }
  }
}
```

See [3D Secure Integration](/3d-secure/integration) for handling the redirect.

### Error — Declined

```json
{
  "meta": {
    "requestId": "payzink-REQ-..."
  },
  "result": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "mid": 1,
    "state": "FAILED",
    "statusCode": "E000005",
    "statusMessage": "Error - Insufficient Funds",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "EUR",
        "value": 5000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/info"
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
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "order": {
      "action": "PURCHASE",
      "amount": {"currencyCode": "EUR", "value": 5000}
    },
    "payment": {
      "pan": "4111111111111111",
      "expiryYear": "2038",
      "expiryMonth": "05",
      "cvv": "123",
      "cardHolderName": "John Doe"
    },
    "customer": {
      "email": "john@example.com",
      "ip": "81.214.125.134"
    },
    "_links": {
      "callbackUrl": "https://yoursite.com/3ds-callback",
      "notificationUrl": "https://yoursite.com/webhooks/payzink"
    }
  }'
```

</TabItem>
<TabItem value="node" label="Node.js">

```javascript
const response = await fetch(
  "https://merchant-dev.payzink.com/api/v1/payment/card",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      order: {
        action: "PURCHASE",
        amount: { currencyCode: "EUR", value: 5000 },
      },
      payment: {
        pan: "4111111111111111",
        expiryYear: "2038",
        expiryMonth: "05",
        cvv: "123",
        cardHolderName: "John Doe",
      },
      customer: { email: "john@example.com", ip: "81.214.125.134" },
      _links: {
        callbackUrl: "https://yoursite.com/3ds-callback",
        notificationUrl: "https://yoursite.com/webhooks/payzink",
      },
    }),
  }
);

const { result } = await response.json();

if (result.state === "AWAIT_3DS") {
  const threeDsUrl = result._links["payment:3ds"].href;
  console.log("Redirect to 3DS:", threeDsUrl);
} else if (result.state === "PURCHASED") {
  console.log("Payment successful:", result.reference);
} else {
  console.log("Payment failed:", result.state, result.statusMessage);
}
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init('https://merchant-dev.payzink.com/api/v1/payment/card');
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
            'amount' => ['currencyCode' => 'EUR', 'value' => 5000],
        ],
        'payment' => [
            'pan' => '4111111111111111',
            'expiryYear' => '2038',
            'expiryMonth' => '05',
            'cvv' => '123',
            'cardHolderName' => 'John Doe',
        ],
        'customer' => ['email' => 'john@example.com', 'ip' => '81.214.125.134'],
        '_links' => [
            'callbackUrl' => 'https://yoursite.com/3ds-callback',
            'notificationUrl' => 'https://yoursite.com/webhooks/payzink',
        ],
    ]),
]);

$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
$result = $data['result'];

if ($result['state'] === 'AWAIT_3DS') {
    header('Location: ' . $result['_links']['payment:3ds']['href']);
    exit;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.post(
    "https://merchant-dev.payzink.com/api/v1/payment/card",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    },
    json={
        "order": {
            "action": "PURCHASE",
            "amount": {"currencyCode": "EUR", "value": 5000},
        },
        "payment": {
            "pan": "4111111111111111",
            "expiryYear": "2038",
            "expiryMonth": "05",
            "cvv": "123",
            "cardHolderName": "John Doe",
        },
        "customer": {"email": "john@example.com", "ip": "81.214.125.134"},
        "_links": {
            "callbackUrl": "https://yoursite.com/3ds-callback",
            "notificationUrl": "https://yoursite.com/webhooks/payzink",
        },
    },
)

result = response.json()["result"]
if result["state"] == "AWAIT_3DS":
    print(f"Redirect to 3DS: {result['_links']['payment:3ds']['href']}")
elif result["state"] == "PURCHASED":
    print(f"Payment successful: {result['reference']}")
```

</TabItem>
</Tabs>

## Next steps

- **[3D Secure Integration](/3d-secure/integration)** — Handle 3DS challenges.
- **[Capture a Payment](/direct-api/capture)** — Capture authorized payments.
- **[Test Cards](/getting-started/test-cards)** — Test different scenarios.

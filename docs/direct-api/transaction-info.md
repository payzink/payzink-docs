---
sidebar_position: 11
title: Transaction Info
description: API reference for retrieving transaction details.
---

# Transaction Info

<span class="badge badge--get">GET</span> `/api/v1/payment/transaction/{reference}/info`

Retrieve full details and current status of a transaction. You can also use the `_links.self.href` URL from any payment response.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/info` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/info` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference (UUID). |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |

No request body.

## Response

### Success — Purchased transaction

```json
{
  "meta": {
    "requestId": "payzink-REQ-abc12345-6789-0abc-def0-123456789abc"
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

### Response fields

| Field | Type | Description |
|-------|------|-------------|
| `meta.requestId` | `string` | Unique API request identifier. |
| `result.reference` | `string` | Transaction reference (UUID). |
| `result.paymentDetail` | `object` | Masked card details. |
| `result.paymentDetail.pan` | `string` | Masked card number (first 4 + last 4 visible). |
| `result.paymentDetail.expiryMonth` | `string` | Masked expiry month. |
| `result.paymentDetail.expiryYear` | `string` | Expiry year. |
| `result.paymentDetail.cvv` | `string` | Always masked (`"***"`). |
| `result.paymentDetail.brand` | `string` | Card brand (`VISA`, `MASTERCARD`, `AMEX`). |
| `result.paymentDetail.cardHolderName` | `string` | Cardholder name. |
| `result.mid` | `integer` | Merchant ID. |
| `result.state` | `string` | Current [payment state](/payment-lifecycle/payment-states). |
| `result.merchantName` | `string` | Your registered merchant name. |
| `result.order` | `object` | Order details (action, amount). |
| `result._links` | `object` | Available actions (HATEOAS links). Only actions valid for the current state are included. |

### Available `_links` by state

| State | Available links |
|-------|----------------|
| `STARTED` | `self`, `payment` |
| `AWAIT_3DS` | `self`, `payment:3ds` |
| `PURCHASED` | `self`, `cancel`, `refund` |
| `AUTHORISED` | `self`, `capture`, `cancel` |
| `CAPTURED` | `self`, `refund` |
| `REVERSED` | `self` |
| `REFUNDED` | `self` |
| `FAILED` | `self` |

## Code examples

```bash
curl -X GET https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/info \
  -H "Authorization: Bearer {accessToken}"
```

## Next steps

- **[Payment States](/payment-lifecycle/payment-states)** — Understand what each state means.
- **[Status Codes](/payment-lifecycle/status-codes)** — Interpret status codes.

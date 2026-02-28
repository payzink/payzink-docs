---
sidebar_position: 8
title: Refund a Transaction
description: API reference for refunding a transaction.
---

# Refund a Transaction

<span class="badge badge--post">POST</span> `/api/v1/payment/transaction/{reference}/refund`

Refund a purchased or captured transaction. Supports full and partial refunds.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/refund` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/refund` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference to refund. |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | `object` | Yes | Refund amount. |
| `amount.currencyCode` | `string` | Yes | Must match the transaction currency. |
| `amount.value` | `string\|integer` | Yes | Amount in minor units. Must be ≤ original amount. |

### Example

```json
{
  "amount": {
    "currencyCode": "USD",
    "value": 50
  }
}
```

## Response

### Success — `200 OK`

Full refund returns `REFUNDED`, partial refund returns `PARTIALLY_REFUNDED`.

```json
{
  "result": {
    "reference": "5a12782e-d539-4479-b419-ef9b9d728b9a",
    "actionReference": "act_refund_001",
    "state": "REFUNDED",
    "statusCode": "S00",
    "amount": {
      "currencyCode": "USD",
      "value": "50"
    }
  }
}
```

## Code examples

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/refund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"amount": {"currencyCode": "USD", "value": 50}}'
```

## Next steps

- **[Refund an Action](/direct-api/refund-action)** — Refund a specific action.
- **[Payment States](/payment-lifecycle/payment-states)** — Understand refund states.

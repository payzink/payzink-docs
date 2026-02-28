---
sidebar_position: 10
title: Refund an Action
description: API reference for refunding a specific action on a transaction.
---

# Refund an Action

<span class="badge badge--post">POST</span> `/api/v1/payment/transaction/{reference}/action/{action_reference}/refund`

Refund a specific action on a transaction (e.g., a specific capture).

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/refund` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/refund` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference. |
| `action_reference` | `string` | Yes | The action reference to refund. |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | `object` | Yes | Refund amount. |
| `amount.currencyCode` | `string` | Yes | Must match the action currency. |
| `amount.value` | `string\|integer` | Yes | Amount to refund. Must be ≤ action amount. |

### Example

```json
{
  "amount": {
    "currencyCode": "AED",
    "value": 400
  }
}
```

## Response

### Success — `200 OK`

```json
{
  "result": {
    "reference": "5a12782e-d539-4479-b419-ef9b9d728b9a",
    "actionReference": "act_capture_001",
    "refundReference": "act_refund_001",
    "state": "PARTIALLY_REFUNDED",
    "statusCode": "S00",
    "amount": {
      "currencyCode": "AED",
      "value": "400"
    }
  }
}
```

## Code examples

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/refund \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"amount": {"currencyCode": "AED", "value": 400}}'
```

## Next steps

- **[Transaction Info](/direct-api/transaction-info)** — Check full transaction status.
- **[Payment States](/payment-lifecycle/payment-states)** — Understand refund states.

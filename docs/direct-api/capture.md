---
sidebar_position: 6
title: Capture a Payment
description: API reference for capturing an authorized payment.
---

# Capture a Payment

<span class="badge badge--post">POST</span> `/api/v1/payment/transaction/{reference}/capture`

Capture a previously authorized payment.

:::warning Capture window
Authorizations typically expire after **7 days**. Uncaptured authorizations are released.
:::

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/capture` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/capture` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference from the authorize response. |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | `object` | Yes | Capture amount. |
| `amount.currencyCode` | `string` | Yes | Must match the authorization currency. |
| `amount.value` | `string\|integer` | Yes | Amount to capture in minor units. Can be ≤ authorized amount. |

### Example — Full capture

```json
{
  "amount": {
    "currencyCode": "USD",
    "value": "2500"
  }
}
```

### Example — Partial capture

```json
{
  "amount": {
    "currencyCode": "USD",
    "value": "50"
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
    "state": "CAPTURED",
    "statusCode": "S00",
    "amount": {
      "currencyCode": "USD",
      "value": "2500"
    }
  }
}
```

Partial capture returns `state: "PARTIALLY_CAPTURED"` with `statusCode: "S02"`.

## Code examples

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/capture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"amount": {"currencyCode": "USD", "value": "2500"}}'
```

## Next steps

- **[Cancel an Action](/direct-api/cancel-action)** — Cancel a capture before settlement.
- **[Refund an Action](/direct-api/refund-action)** — Refund a captured amount.

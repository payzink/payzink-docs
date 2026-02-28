---
sidebar_position: 7
title: Cancel a Transaction (Void)
description: API reference for cancelling/voiding a transaction.
---

# Cancel a Transaction (Void)

<span class="badge badge--delete">DELETE</span> `/api/v1/payment/transaction/{reference}/cancel`

Cancel a transaction before it has been captured/settled. This reverses the authorization.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/cancel` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/cancel` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference. |

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |

No request body is required.

## Response

### Success — `200 OK`

```json
{
  "result": {
    "reference": "5a12782e-d539-4479-b419-ef9b9d728b9a",
    "state": "REVERSED",
    "statusCode": "S00"
  }
}
```

## Code examples

```bash
curl -X DELETE https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/cancel \
  -H "Authorization: Bearer {accessToken}"
```

## Next steps

- **[Refund a Transaction](/direct-api/refund-transaction)** — Refund a captured payment.
- **[Payment States](/payment-lifecycle/payment-states)** — Understand void/reversal states.

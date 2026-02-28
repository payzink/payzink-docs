---
sidebar_position: 9
title: Cancel an Action
description: API reference for cancelling a specific action on a transaction.
---

# Cancel an Action

<span class="badge badge--delete">DELETE</span> `/api/v1/payment/transaction/{reference}/action/{action_reference}/cancel`

Cancel (void) a specific action on a transaction, such as a capture.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/cancel` |
| Production | `https://merchant.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/cancel` |

## Request

### Path parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | Yes | The transaction reference. |
| `action_reference` | `string` | Yes | The action reference to cancel. |

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
    "actionReference": "act_capture_001",
    "state": "VOIDED",
    "statusCode": "S00"
  }
}
```

## Code examples

```bash
curl -X DELETE https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/action/{action_reference}/cancel \
  -H "Authorization: Bearer {accessToken}"
```

## Next steps

- **[Refund an Action](/direct-api/refund-action)** — Refund instead of cancel.
- **[Transaction Info](/direct-api/transaction-info)** — Check full transaction status.

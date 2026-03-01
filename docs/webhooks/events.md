---
sidebar_position: 2
title: Webhook Events
description: Complete list of Payzink webhook events and their payloads.
---

# Webhook Events

This page lists all webhook event types that Payzink can send to your endpoint.

## Event types

### Authorization events

| Event | Trigger |
|-------|---------|
| `PAYMENT.AUTHORISED` | A payment has been successfully authorised (funds reserved). |
| `PAYMENT.AUTHORISATION.FAILED` | An authorization attempt failed. |
| `PAYMENT.DECLINED` | A payment was declined by the issuer or acquirer. |

### Purchase events

| Event | Trigger |
|-------|---------|
| `PAYMENT.PURCHASED` | A payment has been successfully purchased (one-step). |
| `PAYMENT.PURCHASE.FAILED` | A purchase attempt failed. |

### Capture events

| Event | Trigger |
|-------|---------|
| `PAYMENT.CAPTURED` | An authorised payment has been captured. |
| `PAYMENT.CAPTURE.FAILED` | A capture attempt failed. |
| `PAYMENT.CAPTURE.VOIDED` | A capture has been voided. |
| `PAYMENT.CAPTURE.VOID.FAILED` | A capture void attempt failed. |

### Refund events

| Event | Trigger |
|-------|---------|
| `PAYMENT.REFUNDED` | A payment has been fully refunded. |
| `PAYMENT.REFUND_FAILED` | A refund attempt failed. |
| `PAYMENT.PARTIALLY.REFUNDED` | A payment has been partially refunded. |
| `PAYMENT.PARTIALLY.REFUND.FAILED` | A partial refund attempt failed. |

### Reversal events

| Event | Trigger |
|-------|---------|
| `PAYMENT.REVERSED` | An authorization has been reversed/voided before capture. |
| `PAYMENT.REVERSAL.FAILED` | A reversal attempt failed. |

## Payload structure

Every webhook follows the same structure with three top-level keys: `event`, `data`, and `meta`.

```json
{
  "event": "PAYMENT.PURCHASED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "PURCHASED",
    "order": {
      "action": "PURCHASE",
      "amount": 5000,
      "currency": "AED"
    },
    "customer": {
      "country": "TR",
      "email": "john@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

### `data` fields

| Field | Type | Description                                                 |
|-------|------|-------------------------------------------------------------|
| `reference` | `string` | Transaction reference (UUID).                               |
| `state` | `string` | Current [payment state](/payment-lifecycle/payment-states). |
| `order.action` | `string` | `PURCHASE`, `SALE`, `AUTH`.                                 |
| `order.amount` | `integer` | Amount in minor units.                                      |
| `order.currency` | `string` | ISO 4217 currency code.                                     |
| `customer.country` | `string` | Customer country (ISO 3166-1 alpha-2).                      |
| `customer.email` | `string` | Customer email address.                                     |
| `extra` | `object` | Custom key-value pairs from the original payment request.   |

Additional fields may be present depending on the event type and the specific transaction action (e.g., `actionReference` for capture/refund events).

### `meta` fields

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | `string` | Unique event identifier. Use for idempotency. |
| `triggeredAt` | `string` | ISO 8601 timestamp of when the event was triggered. |
| `version` | `string` | Payload version (`1.0.0`). |

## Example payloads

### `PAYMENT.PURCHASED`

```json
{
  "event": "PAYMENT.PURCHASED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "PURCHASED",
    "order": {
      "action": "PURCHASE",
      "amount": 5000,
      "currency": "AED"
    },
    "customer": {
      "country": "TR",
      "email": "john@example.com"
    },
    "extra": {
      "orderId": "MY-ORDER-001"
    }
  },
  "meta": {
    "eventId": "EVT-purch-a1b2c3d4",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.AUTHORISED`

```json
{
  "event": "PAYMENT.AUTHORISED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "AUTHORISED",
    "order": {
      "action": "AUTH",
      "amount": 10000,
      "currency": "USD"
    },
    "customer": {
      "country": "AE",
      "email": "jane@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-auth-e5f67890",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.CAPTURED`

```json
{
  "event": "PAYMENT.CAPTURED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "CAPTURED",
    "order": {
      "action": "AUTH",
      "amount": 10000,
      "currency": "USD"
    },
    "customer": {
      "country": "AE",
      "email": "jane@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-cap-abcd1234",
    "triggeredAt": "2026-02-28T15:00:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.DECLINED`

```json
{
  "event": "PAYMENT.DECLINED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "FAILED",
    "order": {
      "action": "PURCHASE",
      "amount": 5000,
      "currency": "AED"
    },
    "customer": {
      "country": "TR",
      "email": "john@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-dec-56789abc",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.REFUNDED`

```json
{
  "event": "PAYMENT.REFUNDED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "REFUNDED",
    "order": {
      "action": "PURCHASE",
      "amount": 5000,
      "currency": "AED"
    },
    "customer": {
      "country": "TR",
      "email": "john@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-ref-def01234",
    "triggeredAt": "2026-02-28T17:00:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.REVERSED`

```json
{
  "event": "PAYMENT.REVERSED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "REVERSED",
    "order": {
      "action": "AUTH",
      "amount": 10000,
      "currency": "USD"
    },
    "customer": {
      "country": "AE",
      "email": "jane@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-rev-ghij5678",
    "triggeredAt": "2026-02-28T16:00:00+00:00",
    "version": "1.0.0"
  }
}
```

### `PAYMENT.PURCHASE.FAILED`

```json
{
  "event": "PAYMENT.PURCHASE.FAILED",
  "data": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "state": "FAILED",
    "order": {
      "action": "PURCHASE",
      "amount": 5000,
      "currency": "EUR"
    },
    "customer": {
      "country": "TR",
      "email": "john@example.com"
    },
    "extra": {}
  },
  "meta": {
    "eventId": "EVT-pfail-klmn9012",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

## Next steps

- **[Webhook Security](/webhooks/security)** — Verify webhook signatures.
- **[Best Practices](/webhooks/best-practices)** — Handle webhooks reliably.

---
sidebar_position: 1
title: Overview
description: Introduction to Payzink webhooks for real-time payment notifications.
---

# Webhooks

Webhooks allow Payzink to send real-time notifications to your server when payment events occur. Instead of polling the API for status changes, your server receives an HTTP POST request with event details as soon as something happens.

## Why use webhooks?

- **Real-time** — Get notified instantly when a payment state changes.
- **Reliable** — Don't miss events due to network issues or browser closures.
- **Efficient** — No need to repeatedly poll the API for updates.
- **Complete** — Receive notifications for all payment events, even those initiated outside your integration (e.g., refunds from the dashboard).

## How webhooks work

```
┌──────────┐                          ┌──────────┐
│ Payzink  │  1. Payment event occurs │          │
│  System  │ ─────────────────────────│          │
│          │                          │          │
│          │  2. POST event payload   │   Your   │
│          │ ────────────────────────►│  Server  │
│          │                          │          │
│          │  3. 200 OK               │          │
│          │ ◄────────────────────────│          │
└──────────┘                          └──────────┘
```

1. A payment event occurs (e.g., payment authorized, captured, refunded).
2. Payzink sends an HTTP POST request to your configured notification URL with the event payload.
3. Your server processes the event and responds with `200 OK`.

## Setting up webhooks

### 1. Configure your notification URL

You can configure webhooks in two ways:

- **Per-transaction** — Pass `_links.notificationUrl` in the payment request body.
- **Dashboard** — Set a global webhook URL in **Settings → Webhooks** on your [Payzink dashboard](https://console-dev.payzink.com).

### 2. Build your endpoint

Your webhook endpoint must:
- Accept `POST` requests with `Content-Type: application/json`
- Verify the webhook signature (see [Security](/webhooks/security))
- Return `200 OK` quickly (within 5 seconds)
- Process events idempotently

```javascript
import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.raw({ type: "application/json" }));

app.post("/webhooks/payzink", (req, res) => {
  const timestamp = req.headers["x-payzink-timestamp"];
  const signature = req.headers["x-payzink-signature"];
  const rawPayload = req.body.toString();

  // 1. Verify signature: HMAC-SHA256(timestamp + rawPayload, secretKey)
  const expected = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(timestamp + rawPayload)
    .digest("hex");

  if (signature !== expected) {
    return res.status(401).send("Invalid signature");
  }

  // 2. Process the event
  const payload = JSON.parse(rawPayload);
  console.log(`Received event: ${payload.event}`);

  switch (payload.event) {
    case "PAYMENT.PURCHASED":
      handlePurchased(payload.data);
      break;
    case "PAYMENT.AUTHORISED":
      handleAuthorised(payload.data);
      break;
    case "PAYMENT.CAPTURED":
      handleCaptured(payload.data);
      break;
    case "PAYMENT.REFUNDED":
      handleRefunded(payload.data);
      break;
    case "PAYMENT.DECLINED":
      handleDeclined(payload.data);
      break;
    case "PAYMENT.PURCHASE.FAILED":
      handlePurchaseFailed(payload.data);
      break;
  }

  // 3. Respond quickly
  res.status(200).send("OK");
});
```

### 3. Test locally

During development, use a tunneling tool to expose your local server:

```bash
ngrok http 3000
```

Or use [webhook.site](https://webhook.site) to inspect payloads without running your own server.

## Webhook payload structure

Every webhook notification follows this structure:

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
    "eventId": "EVT-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "triggeredAt": "2026-02-28T14:30:00+00:00",
    "version": "1.0.0"
  }
}
```

| Field | Type | Description                                                                    |
|-------|------|--------------------------------------------------------------------------------|
| `event` | `string` | Event type (e.g. `PAYMENT.PURCHASED`). See [Webhook Events](/webhooks/events). |
| `data` | `object` | Event payload data.                                                            |
| `data.reference` | `string` | Transaction reference (UUID).                                                  |
| `data.state` | `string` | Current [payment state](/payment-lifecycle/payment-states).                    |
| `data.order` | `object` | Order details.                                                                 |
| `data.order.action` | `string` | `PURCHASE`, `SALE`, `AUTH`.                                                    |
| `data.order.amount` | `integer` | Amount in minor units.                                                         |
| `data.order.currency` | `string` | ISO 4217 currency code.                                                        |
| `data.customer` | `object` | Customer information.                                                          |
| `data.customer.country` | `string` | Customer's country code (ISO 3166-1 alpha-2).                                  |
| `data.customer.email` | `string` | Customer's email address.                                                      |
| `data.extra` | `object` | Custom key-value pairs passed in the original payment request.                 |
| `meta` | `object` | Webhook metadata.                                                              |
| `meta.eventId` | `string` | Unique event identifier. Use for idempotency.                                  |
| `meta.triggeredAt` | `string` | ISO 8601 timestamp of when the event was triggered.                            |
| `meta.version` | `string` | Webhook payload version.                                                       |

## Webhook HTTP headers

Payzink includes the following headers with every webhook request:

| Header | Description | Example |
|--------|-------------|---------|
| `Content-Type` | Always `application/json` | `application/json` |
| `X-Payzink-Timestamp` | Unix timestamp (seconds) when the webhook was sent | `1709128200` |
| `X-Payzink-Signature` | HMAC-SHA256 signature for verification | `a1b2c3d4e5f6...` |
| `X-Payzink-Signature-Version` | Signature version | `v1` |
| `X-Payzink-Signature-Algorithm` | Hash algorithm used for signature | `sha256` |
| `X-Payzink-Signature-Digest` | SHA-256 hash of the raw payload body | `f8e7d6c5b4a3...` |
| `User-Agent` | Payzink webhook user agent | `PayzinkWebhook/1.0.0 (event=PAYMENT.PURCHASED; ...)` |

## Next steps

- **[Webhook Events](/webhooks/events)** — Full list of event types and payloads.
- **[Webhook Security](/webhooks/security)** — Verify signatures and protect your endpoint.
- **[Best Practices](/webhooks/best-practices)** — Production-ready webhook handling.

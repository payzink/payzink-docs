---
sidebar_position: 4
title: Best Practices
description: Best practices for handling Payzink webhooks in production.
---

# Webhook Best Practices

Follow these practices to ensure your webhook integration is reliable and production-ready.

## Respond quickly

Your endpoint must return a `200 OK` response within **5 seconds**. If Payzink doesn't receive a response in time, it considers the delivery failed and will retry.

**Do:** Acknowledge the webhook immediately, then process asynchronously.

```javascript
app.post("/webhooks/payzink", express.raw({ type: "application/json" }), (req, res) => {
  // Verify signature first (see Security docs)
  if (!verifySignature(req)) {
    return res.status(401).send("Invalid signature");
  }

  // Respond immediately
  res.status(200).send("OK");

  // Process asynchronously
  const payload = JSON.parse(req.body.toString());
  processWebhookAsync(payload).catch(console.error);
});
```

**Don't:** Perform heavy operations (database writes, external API calls) before responding.

## Handle retries

If your endpoint doesn't return `200 OK`, Payzink retries the webhook with exponential backoff:

| Retry | Delay |
|-------|-------|
| 1st | 1 minute |
| 2nd | 5 minutes |
| 3rd | 30 minutes |
| 4th | 2 hours |
| 5th | 12 hours |
| 6th (final) | 24 hours |

After 6 failed attempts, the webhook is marked as permanently failed. You can view failed webhooks in the dashboard.

## Ensure idempotency

Webhooks may be delivered more than once (due to retries or network issues). Use the `meta.eventId` field to ensure you process each event only once:

```javascript
async function processWebhookAsync(payload) {
  const eventId = payload.meta.eventId;

  const existing = await db.webhookEvents.findOne({ eventId });
  if (existing) {
    console.log(`Event ${eventId} already processed, skipping`);
    return;
  }

  await handleEvent(payload.event, payload.data);

  await db.webhookEvents.insertOne({
    eventId,
    event: payload.event,
    reference: payload.data.reference,
    processedAt: new Date(),
  });
}
```

## Handle all event types

Make sure your handler accounts for all event types, including failure events. At minimum, handle:

```javascript
function handleEvent(eventType, data) {
  switch (eventType) {
    // Success events
    case "PAYMENT.PURCHASED":
      return fulfillOrder(data);
    case "PAYMENT.AUTHORISED":
      return markAsAuthorized(data);
    case "PAYMENT.CAPTURED":
      return markAsCaptured(data);
    case "PAYMENT.REFUNDED":
    case "PAYMENT.PARTIALLY.REFUNDED":
      return processRefund(data);
    case "PAYMENT.REVERSED":
      return processReversal(data);

    // Failure events
    case "PAYMENT.DECLINED":
    case "PAYMENT.PURCHASE.FAILED":
    case "PAYMENT.AUTHORISATION.FAILED":
      return markAsFailed(data);
    case "PAYMENT.CAPTURE.FAILED":
      return handleCaptureFailed(data);
    case "PAYMENT.REFUND_FAILED":
    case "PAYMENT.PARTIALLY.REFUND.FAILED":
      return handleRefundFailed(data);
    case "PAYMENT.CAPTURE.VOIDED":
      return handleCaptureVoided(data);

    default:
      console.log(`Unhandled event: ${eventType}`);
  }
}
```

## Handle out-of-order delivery

Webhook events may arrive out of order. For example, you might receive `PAYMENT.REFUNDED` before `PAYMENT.CAPTURED` due to network timing. Design your handler to be resilient:

- Use `meta.triggeredAt` to determine event ordering.
- Check the current state of the resource before applying changes.
- Use the API (`GET /api/v1/payment/transaction/{reference}/info`) to fetch the latest state when in doubt.

## Use the `extra` field

The `data.extra` field in webhooks contains the custom key-value pairs you passed in the original payment request. Use this to correlate webhook events with your internal orders:

```javascript
case "PAYMENT.PURCHASED":
  const orderId = data.extra?.orderId;
  if (orderId) {
    await markOrderAsPaid(orderId, data.reference);
  }
  break;
```

## Use HTTPS

Your webhook endpoint **must** use HTTPS with a valid TLS certificate. Payzink will not deliver webhooks to HTTP (non-secure) endpoints.

## Monitor webhook health

- **Log all received webhooks** for debugging and audit purposes.
- **Set up alerts** for webhook failures (e.g., repeated 500 responses from your endpoint).
- **Review the dashboard** periodically for failed webhook deliveries.
- **Track processing time** to ensure you're responding within the 5-second window.

## Testing webhooks

### During development

1. Use [ngrok](https://ngrok.com) or [webhook.site](https://webhook.site) to expose your local server.
2. Pass the tunnel URL as `_links.notificationUrl` in payment requests.
3. Process test transactions and observe the webhook deliveries.

### Before going live

- [ ] Signature verification is working (using `HMAC-SHA256(timestamp + payload, secretKey)`)
- [ ] Endpoint returns `200 OK` within 5 seconds
- [ ] All event types are handled (including failure events)
- [ ] Idempotency is implemented using `meta.eventId`
- [ ] Out-of-order delivery is handled
- [ ] Errors are logged and monitored

## Next steps

- **[Webhook Events](/webhooks/events)** — Full list of event types.
- **[Webhook Security](/webhooks/security)** — Signature verification.

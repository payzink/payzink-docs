---
sidebar_position: 1
title: Payment States
description: Understanding the Payzink payment lifecycle and state transitions.
---

# Payment States

During the lifecycle of a payment, a transaction can transition through multiple states based on customer actions, authentication steps, authorization results, captures, refunds, or risk outcomes.

These states allow your system to determine whether a transaction is still in progress, successfully completed, partially processed, refunded, cancelled, or failed.

## State diagram

### Purchase flow

```
STARTED ──► AWAIT_3DS ──► PURCHASED
   │            │              │
   │            ▼              ├──► PARTIALLY_REFUNDED
   │          FAILED           │
   ▼                           ▼
 FAILED / CANCELED          REFUNDED
```

### Authorization & Capture flow

```
STARTED ──► AWAIT_3DS ──► AUTHORISED ──► CAPTURED
   │            │              │              │
   │            ▼              ▼              ├──► PARTIALLY_REFUNDED
   │          FAILED        REVERSED         │
   ▼                                         ▼
 FAILED / CANCELED                       REFUNDED

                    AUTHORISED ──► PARTIALLY_CAPTURED ──► REFUNDED
                                          │
                                          ▼
                                   PARTIALLY_REFUNDED
```

## State reference

| State | Description |
|-------|-------------|
| **`STARTED`** | The payment process has been initiated. The customer has started the checkout flow, but no authorization or 3D Secure step has been executed yet. |
| **`AWAIT_3DS`** | Awaiting 3D Secure authentication. The customer has been redirected for 3D Secure verification, and the transaction will proceed once authentication is completed. |
| **`AUTHORISED`** | The payment has been authorised (funds reserved). The issuer has approved the authorization request, but the funds have not yet been captured/settled. |
| **`PURCHASED`** | The payment has been successfully completed. Funds have been authorised and immediately captured in a single step. |
| **`CAPTURED`** | The payment has been captured (settled) successfully. Previously authorised funds have now been collected by the merchant. |
| **`PARTIALLY_CAPTURED`** | The payment has been partially captured. Only a portion of the authorised amount has been captured, or part of a capture has been reversed/cancelled. |
| **`PARTIALLY_REFUNDED`** | The payment has been partially refunded. A portion of the captured amount has been returned to the customer. |
| **`REVERSED`** | The authorization has been reversed (voided before capture). The reserved funds were released back to the customer before settlement. |
| **`REFUNDED`** | The full payment has been refunded. The captured amount has been returned entirely to the customer. |
| **`VOIDED`** | The payment has been voided/cancelled before completion. The transaction was cancelled before it could be captured or settled. |
| **`FAILED`** | The payment failed and could not be completed. The transaction was declined or encountered an error during processing. |
| **`CANCELED`** | The payment was cancelled by the customer or merchant. The transaction was intentionally terminated and will not proceed further. |

## Allowed operations by state

| State | Capture | Cancel (Void) | Refund | Cancel Action | Refund Action |
|-------|---------|---------------|--------|---------------|---------------|
| `STARTED` | — | — | — | — | — |
| `AWAIT_3DS` | — | — | — | — | — |
| `AUTHORISED` | Yes | Yes | — | — | — |
| `PURCHASED` | — | — | Yes | — | — |
| `CAPTURED` | — | — | Yes | Yes (pre-settle) | Yes |
| `PARTIALLY_CAPTURED` | Yes | Yes (remaining) | Yes | Yes | Yes |
| `PARTIALLY_REFUNDED` | — | — | Yes | — | Yes |
| `REVERSED` | — | — | — | — | — |
| `REFUNDED` | — | — | — | — | — |
| `VOIDED` | — | — | — | — | — |
| `FAILED` | — | — | — | — | — |
| `CANCELED` | — | — | — | — | — |

## State transition triggers

| From State | To State | Trigger |
|------------|----------|---------|
| `STARTED` | `AWAIT_3DS` | 3DS authentication required |
| `STARTED` | `AUTHORISED` | Successful authorization (no 3DS) |
| `STARTED` | `PURCHASED` | Successful purchase (no 3DS) |
| `STARTED` | `FAILED` | Payment declined or error |
| `STARTED` | `CANCELED` | Customer or merchant cancelled |
| `AWAIT_3DS` | `AUTHORISED` | 3DS authentication succeeded (authorize) |
| `AWAIT_3DS` | `PURCHASED` | 3DS authentication succeeded (purchase) |
| `AWAIT_3DS` | `FAILED` | 3DS authentication failed or timed out |
| `AUTHORISED` | `CAPTURED` | Full capture |
| `AUTHORISED` | `PARTIALLY_CAPTURED` | Partial capture |
| `AUTHORISED` | `REVERSED` | Authorization reversed/voided |
| `PURCHASED` | `REFUNDED` | Full refund |
| `PURCHASED` | `PARTIALLY_REFUNDED` | Partial refund |
| `CAPTURED` | `REFUNDED` | Full refund |
| `CAPTURED` | `PARTIALLY_REFUNDED` | Partial refund |
| `CAPTURED` | `VOIDED` | Capture cancelled before settlement |
| `PARTIALLY_CAPTURED` | `CAPTURED` | Additional capture |
| `PARTIALLY_CAPTURED` | `REFUNDED` | Full refund of captured amount |
| `PARTIALLY_CAPTURED` | `PARTIALLY_REFUNDED` | Partial refund |
| `PARTIALLY_REFUNDED` | `REFUNDED` | Remaining amount refunded |

## Using states in your integration

You can use these states to:

- **Display correct order status** to customers or merchants
- **Trigger internal workflows** (e.g., fulfillment, cancellation)
- **Handle exceptions** such as partial captures or chargebacks
- **Maintain an accurate transaction history**

```javascript
function getCustomerMessage(state) {
  switch (state) {
    case "PURCHASED":
    case "CAPTURED":
      return "Payment successful! Your order is being processed.";
    case "AUTHORISED":
      return "Payment authorized. Your card will be charged when the order ships.";
    case "AWAIT_3DS":
      return "Please complete the verification with your bank.";
    case "PARTIALLY_REFUNDED":
      return "A partial refund has been processed to your card.";
    case "REFUNDED":
      return "Your payment has been fully refunded.";
    case "REVERSED":
    case "VOIDED":
    case "CANCELED":
      return "Your payment has been cancelled.";
    case "FAILED":
      return "Payment failed. Please try again or use a different payment method.";
    default:
      return "Your payment is being processed.";
  }
}
```

## Next steps

- **[Status Codes](/payment-lifecycle/status-codes)** — Understand status codes returned with each state.
- **[Webhooks](/webhooks/overview)** — Get notified when states change.

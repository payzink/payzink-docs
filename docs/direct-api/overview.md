---
sidebar_position: 1
title: Overview
description: Learn about Payzink's Direct API integration for full checkout control.
---

# Direct API

The Direct API gives you full control over the payment experience. Collect card details in your own frontend and send them directly to Payzink for processing.

## Why use the Direct API?

- **Full control** — Design your own checkout UI and payment flow.
- **No redirects** — Customers stay on your website throughout the process.
- **Advanced logic** — Implement custom authorization, capture, and refund workflows.
- **Server-to-server** — All API calls happen between your server and Payzink.

:::caution PCI DSS requirement
Because card data passes through your systems, Direct API integration requires **PCI DSS SAQ-D** compliance.
:::

## Payment flows

### Purchase flow (one-step)

```
POST /payment/card (action: PURCHASE)  →  PURCHASED  →  SETTLED
```

**Use when:** You can fulfill immediately (digital goods, subscriptions, etc.)

### Authorization & Capture flow (two-step)

```
POST /payment/card (action: AUTHORIZE)  →  AUTHORISED  →  CAPTURED  →  SETTLED
```

**Use when:** You need to verify stock or ship before charging.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| <span class="badge badge--post">POST</span> | `/api/v1/auth/access-token` | [Get an access token](/authentication/access-token) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/init` | [Initialize a payment](/direct-api/payment-initialization) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/card` | [Payment with credit card](/direct-api/payment-credit-card) |
| <span class="badge badge--post">POST</span> | `/api/v1/bin/info` | [BIN lookup](/direct-api/bin-lookup) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{reference}/capture` | [Capture a payment](/direct-api/capture) |
| <span class="badge badge--delete">DELETE</span> | `/api/v1/payment/transaction/{reference}/cancel` | [Cancel a transaction (void)](/direct-api/cancel-transaction) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{reference}/refund` | [Refund a transaction](/direct-api/refund-transaction) |
| <span class="badge badge--delete">DELETE</span> | `/api/v1/payment/transaction/{ref}/action/{action_ref}/cancel` | [Cancel an action](/direct-api/cancel-action) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{ref}/action/{action_ref}/refund` | [Refund an action](/direct-api/refund-action) |
| <span class="badge badge--get">GET</span> | `/api/v1/payment/transaction/{reference}/info` | [Transaction info](/direct-api/transaction-info) |

## Next steps

- **[Getting Started with Direct API](/direct-api/getting-started)** — Step-by-step integration guide.
- **[Payment Initialization](/direct-api/payment-initialization)** — Initialize before processing.
- **[Payment with Credit Card](/direct-api/payment-credit-card)** — Process your first direct payment.

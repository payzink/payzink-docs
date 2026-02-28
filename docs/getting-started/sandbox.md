---
sidebar_position: 3
title: Sandbox Environment
description: Set up and use the Payzink sandbox for testing your integration.
---

# Sandbox Environment

The Payzink sandbox is a fully functional test environment that mirrors the production API. Use it to develop and test your integration without processing real payments.

## Sandbox vs Production

| | Sandbox | Production |
|---|---|---|
| **Merchant API** | `https://merchant-dev.payzink.com` | `https://merchant.payzink.com` |
| **Payment (3DS) Domain** | `https://payment-dev.payzink.com` | `https://payment.payzink.com` |
| **Dashboard** | [console-dev.payzink.com](https://console-dev.payzink.com) | [console.payzink.com](https://console.payzink.com) |
| **Real money** | No | Yes |
| **Card networks** | Simulated | Live |
| **3D Secure** | Simulated challenges | Real bank challenges |
| **Webhooks** | Fully supported | Fully supported |
| **Rate limits** | Relaxed | Standard |

## Setting up your sandbox account

1. Go to [console-dev.payzink.com](https://console-dev.payzink.com) and create an account.
2. Once logged in, navigate to **Settings → API Credentials**.
3. Copy your **Publishable Key** (`pk_test_...`) and **Secret Key** (`sk_test_...`).
4. Store your credentials securely — never expose the Secret Key in client-side code or commit it to version control.

:::caution Keep your credentials safe
Your Secret Key is shown only once when generated. If you lose it, you will need to generate a new one from the dashboard.
:::

## What you can test

The sandbox supports the full payment lifecycle:

- **Authentication** — Request access tokens
- **Hosted Payment Page** — Create hosted payments and redirect to the test checkout page
- **Direct API** — Send card payments directly
- **Apple Pay / PayPal / Stripe** — Test alternative payment methods
- **Authorization & Capture** — Pre-authorize and capture payments
- **Void** — Cancel authorizations
- **Refunds** — Refund captured or purchased payments
- **BIN Lookup** — Query card BIN information
- **Webhooks** — Receive notifications at your configured endpoint
- **3D Secure** — Test challenge and frictionless flows

## Sandbox behavior

### Simulated processing
All transactions in the sandbox are simulated. No real money is charged, and no real bank communication occurs. However, the API responses and payment states behave identically to production.

### Test cards
Use the [test cards](/getting-started/test-cards) to simulate different payment outcomes including approvals, declines, and 3D Secure challenges.

### Webhook testing
Configure your webhook URL in the sandbox dashboard under **Settings → Webhooks**. You can use tools like [webhook.site](https://webhook.site) or [ngrok](https://ngrok.com) to receive webhooks during development.

## Limitations

- Sandbox transactions are automatically purged after **90 days**.
- Settlement and payout simulations are not available.
- Some edge cases in 3D Secure may behave differently than production.

## Next steps

- **[Test Cards](/getting-started/test-cards)** — See the full list of test card numbers.
- **[Going Live](/getting-started/going-live)** — Prepare your integration for production.

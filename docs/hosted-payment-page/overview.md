---
sidebar_position: 1
title: Overview
description: Learn about Payzink's Hosted Payment Page integration method.
---

# Hosted Payment Page

The Hosted Payment Page (HPP) is a secure, Payzink-managed checkout page where your customers enter their payment details. This is the **simplest integration method** and is recommended for most businesses.

## Why use the Hosted Payment Page?

- **Lowest PCI scope** — Card details never touch your servers (SAQ-A).
- **Mobile-responsive** — Optimized for all screen sizes out of the box.
- **3D Secure built-in** — Authentication is handled automatically.
- **Multiple payment methods** — Supports all card networks and payment methods enabled on your account.
- **Customizable** — Add your logo, colors, and branding to the payment page.

## How it works

```
┌──────────┐         ┌──────────┐         ┌─────────────────────┐
│ Customer │         │   Your   │         │ merchant.payzink.com│
│ Browser  │         │  Server  │         │ payment.payzink.com │
└────┬─────┘         └────┬─────┘         └────────┬────────────┘
     │  1. Checkout        │                        │
     │ ──────────────────► │                        │
     │                     │ 2. POST /payment/hosted│
     │                     │ ──────────────────────►│
     │                     │ 3. reference + URL     │
     │                     │ ◄──────────────────────│
     │  4. Redirect to HPP │                        │
     │ ◄────────────────── │                        │
     │                     │                        │
     │  5. Enter card details on checkout page      │
     │ ────────────────────────────────────────────►│
     │                     │                        │
     │  6. 3DS (if needed) │                        │
     │ ◄───────────────────────────────────────────►│
     │                     │                        │
     │  7. Redirect back   │                        │
     │ ──────────────────► │                        │
     │                     │ 8. GET /transaction/info│
     │                     │ ──────────────────────►│
     │                     │ 9. Status response     │
     │                     │ ◄──────────────────────│
     │  10. Show result    │                        │
     │ ◄────────────────── │                        │
```

### Step-by-step flow

1. **Customer clicks "Pay"** on your website.
2. **Your server creates a hosted payment** via `POST /api/v1/payment/hosted`, specifying the amount, currency, and redirect URLs.
3. **Payzink returns a transaction reference and a checkout URL** in `result._links.payment.href` (hosted on `payment.payzink.com`).
4. **You redirect the customer** to the `_links.payment.href` URL.
5. **The customer enters card details** on the secure Payzink-hosted page.
6. **3D Secure authentication** is performed if required by the issuing bank.
7. **Payzink redirects the customer** back to your `redirectUrl` (or `cancelUrl` if cancelled).
8. **Your server queries the transaction info** via `GET /api/v1/payment/transaction/{reference}/info`.
9. **Payzink returns the current transaction state** and payment details.
10. **You display the result** to the customer.

## Payment actions

| Action | Description | When to use |
|--------|-------------|-------------|
| `PURCHASE` | Charge the card immediately | One-step payment for goods/services |
| `AUTHORIZE` | Reserve the amount on the card | When you need to capture later (e.g., ship then charge) |

With `AUTHORIZE`, you must later [capture the payment](/direct-api/capture) to collect the funds.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| <span class="badge badge--post">POST</span> | `/api/v1/auth/access-token` | [Get an access token](/authentication/access-token) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/hosted` | [Create a hosted payment](/hosted-payment-page/create-hosted-payment) |
| <span class="badge badge--get">GET</span> | `/api/v1/payment/transaction/{reference}/info` | [Retrieve transaction info](/hosted-payment-page/retrieve-transaction) |

## Next steps

- **[Getting Started with HPP](/hosted-payment-page/getting-started)** — Step-by-step integration guide.
- **[Create a Hosted Payment](/hosted-payment-page/create-hosted-payment)** — API reference.

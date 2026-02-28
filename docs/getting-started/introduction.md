---
sidebar_position: 1
slug: /
title: Introduction
description: Get started with Payzink — a payment service provider API for accepting online payments.
---

# Introduction

Payzink is a payment service provider (PSP) that enables businesses to accept online payments securely. Whether you're a small e-commerce store or a large enterprise platform, Payzink provides the tools you need to process card payments, manage refunds, and handle the full payment lifecycle.

## What can you do with Payzink?

- **Accept payments** — Process credit/debit card, Apple Pay, PayPal, and Stripe payments.
- **Authorize & capture** — Place a hold on a customer's card and capture funds later.
- **Refund payments** — Issue full or partial refunds for captured or purchased transactions.
- **Void authorizations** — Cancel an authorization before it is captured.
- **BIN lookup** — Retrieve card information from a BIN number.
- **Track payment status** — Query the status of any transaction in real time.
- **Receive notifications** — Get webhook callbacks when payment states change.

## Supported payment methods

| Method | Details | Module |
|--------|---------|--------|
| Credit / Debit Card | Visa, Mastercard, American Express | Direct API, Hosted Payment Page |
| Apple Pay | Apple Pay integration | Hosted Payment Page |
| Google Pay | Google Pay integration | Hosted Payment Page |
| PayPal | PayPal checkout | Hosted Payment Page 

## Supported currencies

Payzink supports multi-currency processing. Common currencies include:

`AED` `USD` `EUR` `GBP` `TRY` `AUD` `SAR` `BHD` `KWD` `QAR` `OMR` `EGP`

Contact your relationship manager for the full list of supported currencies for your merchant account.

## Integration methods

Payzink offers two primary integration methods:

| | Hosted Payment Page | Direct API |
|---|---|---|
| **Complexity** | Low | High |
| **PCI requirement** | SAQ-A (lowest) | SAQ-D (highest) |
| **Customization** | Limited (branding options) | Full control |
| **Card data handling** | Payzink handles card data | You handle card data |
| **Best for** | Quick integration, small/medium businesses | Custom checkout, large enterprises |
| **3D Secure** | Handled automatically | You manage the redirect flow |

### Hosted Payment Page

Redirect your customer to a secure, Payzink-hosted checkout page. Payzink collects card details, processes the payment, and redirects the customer back to your site.

[Get started with Hosted Payment Page →](/hosted-payment-page/overview)

### Direct API

Collect card details in your own frontend and send them directly to Payzink's API. This gives you full control over the checkout experience but requires PCI DSS compliance.

[Get started with Direct API →](/direct-api/overview)

## Domains & Base URLs

Payzink uses separate domains for the **Merchant API** (your server-to-server calls) and the **Payment domain** (customer-facing checkout and 3DS pages).

### Merchant API

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://merchant-dev.payzink.com` |
| Production | `https://merchant.payzink.com` |

### Payment (Checkout & 3DS)

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://payment-dev.payzink.com` |
| Production | `https://payment.payzink.com` |

### Merchant Dashboard

| Environment | URL |
|-------------|-----|
| Sandbox | [console-dev.payzink.com](https://console-dev.payzink.com) |
| Production | [console.payzink.com](https://console.payzink.com) |

:::tip Start with the Sandbox
We strongly recommend developing and testing against the sandbox environment before going live. See [Sandbox Environment](/getting-started/sandbox) for details.
:::

## Next steps

1. **[Quick Start Guide](/getting-started/quick-start)** — Make your first API call in under 5 minutes.
2. **[Sandbox Environment](/getting-started/sandbox)** — Set up your test account.
3. **[Authentication](/authentication/overview)** — Learn how to authenticate your API requests.

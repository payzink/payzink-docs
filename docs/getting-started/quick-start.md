---
sidebar_position: 2
title: Quick Start Guide
description: Make your first Payzink API call in under 5 minutes.
---

# Quick Start Guide

Follow these steps to process your first payment using the Payzink sandbox. This guide uses the **Hosted Payment Page** method — the fastest way to get started.

## Prerequisites

- A Payzink sandbox account ([sign up here](https://console-dev.payzink.com))
- Your **Publishable Key** and **Secret Key** from the sandbox dashboard
- `curl` or any HTTP client (Postman, Insomnia, etc.)

## Step 1: Get an access token

All API requests require a Bearer token. Request one using your credentials:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/auth/access-token \
  -H "Content-Type: application/json" \
  -d '{
    "publishableKey": "pk_test_xxxxxxxxxxxx",
    "secretKey": "sk_test_xxxxxxxxxxxx"
  }'
```

**Response:**

```json
{
  "result": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "bearer",
    "expiresIn": 300
  }
}
```

Save the `result.accessToken` — you'll use it in the next step.

## Step 2: Create a hosted payment

Create a payment using the hosted method:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/hosted \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "customer": {
      "email": "customer@example.com"
    },
    "_links": {
      "notificationUrl": "https://yourwebsite.com/webhooks/payzink"
    }
  }'
```

:::note About the amount
The `value` field is in **minor units**. For AED, `1000` means **10.00 AED** (1000 fils). For USD, `1000` means **$10.00** (1000 cents).
:::

**Response:**

```json
{
  "meta": {
    "requestId": "payzink-REQ-cbc39185-c4d0-4c5f-8c09-324e5f4ffa89"
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "mid": 1,
    "state": "STARTED",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      },
      "payment": {
        "href": "https://payment-dev.payzink.com/checkout/02204c33-a250-45f2-ac73-3714acd6cbb1"
      }
    }
  }
}
```

## Step 3: Redirect the customer

Redirect your customer to the URL in `result._links.payment.href`. Payzink will:

1. Display a secure payment form
2. Collect card details from the customer
3. Process the payment (including 3D Secure if required)
4. Redirect the customer back to your site

For testing, use the test card:

| Field | Value |
|-------|-------|
| Card number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/27`) |
| CVV | `123` |
| Cardholder name | Any name |

## Step 4: Check payment status

After the customer completes payment, verify the status using the `result._links.self.href` URL or construct it manually:

```bash
curl -X GET https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "meta": {
    "requestId": "payzink-REQ-abc12345-6789-0abc-def0-123456789abc"
  },
  "result": {
    "reference": "02204c33-a250-45f2-ac73-3714acd6cbb1",
    "paymentDetail": {
      "pan": "4111********1111",
      "expiryMonth": "***",
      "expiryYear": "2027",
      "cvv": "***",
      "brand": "VISA",
      "cardHolderName": "John Doe"
    },
    "mid": 1,
    "state": "PURCHASED",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "_links": {
      "self": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info"
      },
      "cancel": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/cancel"
      },
      "refund": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/refund"
      }
    }
  }
}
```

A `state` of `PURCHASED` means the payment was successful.

## What's next?

- **[Sandbox Environment](/getting-started/sandbox)** — Understand the test environment in detail.
- **[Test Cards](/getting-started/test-cards)** — Test different scenarios (declined payments, 3DS, etc.).
- **[Hosted Payment Page](/hosted-payment-page/overview)** — Full integration guide.
- **[Direct API](/direct-api/overview)** — Build a custom checkout experience.
- **[Webhooks](/webhooks/overview)** — Receive real-time payment notifications.

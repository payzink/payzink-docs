---
sidebar_position: 2
title: Getting Started
description: Step-by-step guide to integrating the Payzink Direct API.
---

# Getting Started with Direct API

This guide walks you through making your first direct card payment.

## Prerequisites

- Sandbox API credentials ([sign up](https://console-dev.payzink.com))
- PCI DSS SAQ-D compliance (for production)
- A server-side application capable of making HTTPS requests

## Step 1: Get an access token

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/auth/access-token \
  -H "Content-Type: application/json" \
  -d '{
    "publishableKey": "pk_test_xxxxxxxxxxxx",
    "secretKey": "sk_test_xxxxxxxxxxxx"
  }'
```

```json
{
  "result": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "bearer",
    "expiresIn": 300
  }
}
```

## Step 2: Initialize a payment (optional)

Initialize the payment session to retrieve merchant configuration:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{}'
```

```json
{
  "meta": {
    "requestId": "payzink-REQ-b0f6a946-56f6-4b65-be4f-1fcbfa1d01e1"
  },
  "result": {
    "mid": 1,
    "merchantName": "Your Merchant Name",
    "countryCode": "TR",
    "primaryPaymentMethod": "creditCard",
    "paymentMethods": ["creditCard"]
  }
}
```

See [Payment Initialization](/direct-api/payment-initialization) for details.

## Step 3: Process a card payment

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 1000
      }
    },
    "payment": {
      "pan": "4111111111111111",
      "expiryYear": "2038",
      "expiryMonth": "05",
      "cvv": "123",
      "cardHolderName": "John Doe"
    },
    "customer": {
      "email": "john@example.com",
      "ip": "81.214.125.134"
    },
    "_links": {
      "callbackUrl": "https://yoursite.com/3ds-callback",
      "notificationUrl": "https://yoursite.com/webhooks/payzink"
    }
  }'
```

## Step 4: Handle the response

### No 3DS required — Payment complete

```json
{
  "meta": {
    "requestId": "payzink-REQ-520e2f44-d0ee-4b8f-bc2c-2f6ad0fcbbd9"
  },
  "result": {
    "reference": "c50f8ad8-4351-469a-90e5-3ae846826175",
    "paymentDetail": {
      "pan": "4111********1111",
      "expiryMonth": "***",
      "expiryYear": "2038",
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
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/info"
      },
      "cancel": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/cancel"
      },
      "refund": {
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/refund"
      }
    }
  }
}
```

### 3DS required — Redirect needed

```json
{
  "meta": {
    "requestId": "payzink-REQ-eca29fd6-7413-4e21-b3d2-a7d27eeb2e5a"
  },
  "result": {
    "reference": "1325ce74-4f82-4394-a25d-67a9333e5b24",
    "paymentDetail": {
      "pan": "4111********1111",
      "expiryMonth": "***",
      "expiryYear": "2038",
      "cvv": "***",
      "brand": "VISA",
      "cardHolderName": "John Doe"
    },
    "mid": 1,
    "state": "AWAIT_3DS",
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
        "href": "https://merchant-dev.payzink.com/api/v1/payment/transaction/1325ce74-4f82-4394-a25d-67a9333e5b24/info"
      },
      "payment:3ds": {
        "href": "https://payment-dev.payzink.com/3ds/1325ce74-4f82-4394-a25d-67a9333e5b24"
      }
    }
  }
}
```

When you receive `state: "AWAIT_3DS"`:
1. Redirect the customer to `result._links["payment:3ds"].href`.
2. The customer authenticates with their bank.
3. Payzink redirects back to your `_links.callbackUrl`.
4. Query the transaction info to get the final result.

## Step 5: Verify the result

```bash
curl -X GET https://merchant-dev.payzink.com/api/v1/payment/transaction/c50f8ad8-4351-469a-90e5-3ae846826175/info \
  -H "Authorization: Bearer {accessToken}"
```

## Authorization & Capture flow

Use `"action": "AUTHORIZE"` in the order, then capture later:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/capture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"amount": {"currencyCode": "AED", "value": 1000}}'
```

## Next steps

- **[Payment Initialization](/direct-api/payment-initialization)** — Initialize payment sessions.
- **[Payment with Credit Card](/direct-api/payment-credit-card)** — Full endpoint reference.
- **[3D Secure](/3d-secure/overview)** — Understand the 3DS flow.

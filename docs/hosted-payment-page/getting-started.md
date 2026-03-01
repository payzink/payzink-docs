---
sidebar_position: 2
title: Getting Started with HPP
description: Step-by-step guide to integrating the Hosted Payment Page.
---

# Getting Started with HPP

This guide walks you through a complete Hosted Payment Page integration.

## Integration steps

### Step 1: Authenticate

Request an access token using your credentials.

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

### Step 2: Create a hosted payment

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/hosted \
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
    "customer": {
      "email": "customer@example.com"
    },
    "extra": {
      "orderId": "MY-ORDER-001"
    },
    "_links": {
      "notificationUrl": "https://yoursite.com/webhooks/payzink"
    }
  }'
```

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

### Step 3: Redirect customer to checkout

Redirect the customer to `result._links.payment.href`. The customer will:

1. Enter payment details on the Payzink hosted checkout page
2. Complete 3D Secure authentication (if required)
3. Be redirected back to your site

```javascript
window.location.href = result._links.payment.href;
```

### Step 4: Verify payment status

After the customer returns, verify the transaction using `result._links.self.href`:

```bash
curl -X GET https://merchant-dev.payzink.com/api/v1/payment/transaction/02204c33-a250-45f2-ac73-3714acd6cbb1/info \
  -H "Authorization: Bearer {accessToken}"
```

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

:::warning Always verify server-side
Never trust client-side redirect parameters alone. Always verify the transaction status via `GET /api/v1/payment/transaction/{reference}/info`.
:::

## Authorize + Capture flow

To separate authorization from capture:

1. Create hosted payment with `"action": "AUTH"`.
2. Customer completes checkout → transaction becomes `AUTHORISED`.
3. Capture when you're ready:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/transaction/{reference}/capture \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"amount": {"currencyCode": "AED", "value": 1000}}'
```

## Next steps

- **[Create a Hosted Payment](/hosted-payment-page/create-hosted-payment)** — Full API reference.
- **[Retrieve Transaction](/hosted-payment-page/retrieve-transaction)** — Check payment status.

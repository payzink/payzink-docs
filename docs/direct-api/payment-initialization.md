---
sidebar_position: 3
title: Payment Initialization
description: API reference for initializing a payment session.
---

# Payment Initialization

<span class="badge badge--post">POST</span> `/api/v1/payment/init`

Initialize a payment session. This retrieves your merchant configuration (supported payment methods, integrations) and optionally creates a transaction reference.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/payment/init` |
| Production | `https://merchant.payzink.com/api/v1/payment/init` |

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | `string` | No | An existing transaction reference to resume. If omitted, a new session is initialized. |

### Example request

```json
{}
```

Or to resume an existing transaction:

```json
{
  "reference": "5a12782e-d539-4479-b419-ef9b9d728b9a"
}
```

## Response

### Success — `200 OK`

```json
{
  "meta": {
    "requestId": "payzink-REQ-b0f6a946-56f6-4b65-be4f-1fcbfa1d01e1"
  },
  "result": {
    "mid": 1,
    "merchantName": "Your Merchant Name",
    "merchantNameSignatured": "Your Merchant Name - Payzink",
    "countryCode": "TR",
    "order": [],
    "primaryPaymentMethod": "creditCard",
    "paymentMethods": [
      "creditCard"
    ],
    "integrations": []
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `meta.requestId` | `string` | Unique identifier for this API request. |
| `result.mid` | `integer` | Merchant ID. |
| `result.merchantName` | `string` | Your registered merchant name. |
| `result.merchantNameSignatured` | `string` | Merchant name with Payzink signature. |
| `result.countryCode` | `string` | Merchant's registered country (ISO 3166-1 alpha-2). |
| `result.order` | `array` | Order details (empty array if no order exists yet). |
| `result.primaryPaymentMethod` | `string` | Default payment method for this merchant. |
| `result.paymentMethods` | `array` | List of available payment methods. |
| `result.integrations` | `array` | Active integrations for this merchant. |

## Code examples

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/init \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{}'
```

## Next steps

- **[Payment with Credit Card](/direct-api/payment-credit-card)** — Process the payment after initialization.
- **[BIN Lookup](/direct-api/bin-lookup)** — Check card BIN info before payment.

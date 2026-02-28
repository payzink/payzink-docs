---
sidebar_position: 2
title: Error Handling
description: Best practices for handling errors from the Payzink API.
---

# Error Handling

A robust error handling strategy is critical for a reliable payment integration.

## Response structure

All Payzink API responses include a `meta` object and either a `result` or `error` object:

**Success response:**
```json
{
  "meta": { "requestId": "payzink-REQ-..." },
  "result": { ... }
}
```

**Error response:**
```json
{
  "meta": { "requestId": "payzink-REQ-..." },
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Amount value must be greater than zero."
  }
}
```

## Error categories

| Category | HTTP Codes | Payzink Codes | Action |
|----------|-----------|---------------|--------|
| **Client errors** | 400, 401, 403, 404, 409, 422 | — | Fix the request |
| **Payment errors** | 200/422 | `E000000`–`E000013` | Show message to customer |
| **Fraud blocks** | 200/422 | `F000000`–`F000002` | Do not retry |
| **Rate limiting** | 429 | — | Retry after delay |
| **Server errors** | 500, 502, 503 | — | Retry with backoff |

## Handling payment states

Check `result.state` to determine the payment outcome. For failed payments, `result.statusCode` and `result.statusMessage` provide details:

```javascript
async function handlePaymentResponse(apiResponse) {
  const { result } = apiResponse;

  switch (result.state) {
    case "PURCHASED":
    case "AUTHORISED":
      return { success: true, reference: result.reference };

    case "AWAIT_3DS":
      return {
        requires3DS: true,
        redirectUrl: result._links["payment:3ds"].href,
      };

    case "FAILED":
      if (result.statusCode?.startsWith("F")) {
        logFraudAttempt(result.reference, result.statusCode);
        return { success: false, error: "Transaction blocked for security reasons." };
      }
      return { success: false, error: result.statusMessage };

    default:
      return { success: false, error: "Unexpected payment state." };
  }
}
```

## Retry strategy

| Error type | Retry? | Strategy |
|------------|--------|----------|
| `AWAIT_3DS` | No | Redirect customer to `_links["payment:3ds"].href` |
| `E000000` (general error) | Yes | Retry once after 2 seconds |
| `E000001`–`E000003` (3DS errors) | Yes | Ask customer to retry |
| `E000004`–`E000012` (card errors) | No | Show error, ask for different card |
| `F000000`–`F000002` (fraud) | **Never** | Block and log |
| `401` (token expired) | Yes | Get new token, retry once |
| `429` (rate limit) | Yes | Wait for `Retry-After` header |
| `500`/`502`/`503` | Yes | Exponential backoff (max 3 attempts) |

## Exponential backoff

```javascript
async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn();
      if (response.ok || ![500, 502, 503].includes(response.status)) {
        return response;
      }
      if (attempt === maxRetries) return response;
    } catch (networkError) {
      if (attempt === maxRetries) throw networkError;
    }
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    await new Promise((r) => setTimeout(r, delay));
  }
}
```

## Using `_links` for available actions

The response `_links` object tells you which actions are available for the current transaction state. Always use these URLs rather than constructing them manually:

```javascript
const { result } = await response.json();

if (result._links.refund) {
  console.log("Refund available at:", result._links.refund.href);
}

if (result._links.capture) {
  console.log("Capture available at:", result._links.capture.href);
}
```

## Idempotency

:::danger Payment status after network errors
If you receive a network error during a payment request, the payment **may or may not** have been processed. **Always** query [Transaction Info](/direct-api/transaction-info) before retrying.
:::

## Debugging with `requestId`

Every response includes `meta.requestId`. Include this in support tickets to help the Payzink team trace your request:

```
payzink-REQ-520e2f44-d0ee-4b8f-bc2c-2f6ad0fcbbd9
```

## Next steps

- **[Status Codes](/payment-lifecycle/status-codes)** — Full list of Payzink status codes.
- **[Webhooks](/webhooks/overview)** — Reliable event processing.

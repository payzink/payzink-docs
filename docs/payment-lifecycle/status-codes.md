---
sidebar_position: 2
title: Status Codes
description: Payzink API status codes for transaction results.
---

# Status Codes

Payzink API returns a standardized set of status codes to indicate the result of a transaction or payment-related operation.

These codes help you determine whether a request was successful, requires additional customer action (e.g. 3D Secure), or failed due to an error such as invalid card details, insufficient funds, or suspected fraud.

## Status code format

Each status code follows a structured format and is grouped into logical categories:

| Prefix | Category | Description |
|--------|----------|-------------|
| **S** | Success | The transaction was approved or completed successfully. |
| **E** | Error | The transaction failed due to validation, card, or processing issues. |
| **F** | Fraud / Risk | The transaction was declined due to fraud detection or high-risk assessment. |

By checking the `statusCode` in the API response, your system can determine the appropriate next step (e.g. display a message to the user, retry the transaction, prompt 3DS authentication, or block the request).

## Success codes

| Status Code | Description |
|-------------|-------------|
| `S00` | **Success** — Transaction approved and completed. |
| `S01` | **Success - 3DS** — 3D Secure authentication is required. Redirect the customer to the 3DS URL. |
| `S02` | **Success - Partial** — Partial operation completed (e.g., partial capture or partial refund). |
| `S03` | **Success - VIP** — VIP transaction approved. |

### Handling success codes

```javascript
switch (statusCode) {
  case "S00":
    // Payment complete — fulfill the order
    fulfillOrder(reference);
    break;
  case "S01":
    // 3DS required — redirect customer
    redirectTo3DS(threeDSecure.redirectUrl);
    break;
  case "S02":
    // Partial success — check amounts
    handlePartialOperation(response);
    break;
  case "S03":
    // VIP success
    fulfillOrder(reference);
    break;
}
```

## Error codes

| Status Code | Description | Suggested Action |
|-------------|-------------|------------------|
| `E000000` | **Error** — General processing error. | Retry after a short delay. |
| `E000001` | **Error - 3DS** — 3D Secure processing error. | Ask customer to retry. |
| `E000002` | **Error - 3DS Invalid PIN** — Customer entered an invalid 3DS PIN/OTP. | Ask customer to retry with correct credentials. |
| `E000003` | **Error - 3DS Timeout** — 3D Secure authentication timed out. | Ask customer to retry. |
| `E000004` | **Error - Invalid Card** — The card number is invalid. | Ask customer to check their card details. |
| `E000005` | **Error - Insufficient Funds** — The card has insufficient funds. | Ask customer to use a different card. |
| `E000006` | **Error - Lost or Stolen Card** — The card has been reported lost or stolen. | Do not retry. Ask for a different card. |
| `E000007` | **Error - Expired Card** — The card has expired. | Ask customer to use a different card. |
| `E000008` | **Error - Invalid CVV** — The CVV/CVC is incorrect. | Ask customer to re-enter their CVV. |
| `E000009` | **Error - Card BIN Blocked** — The card BIN is blocked by your configuration. | Card is restricted. Ask for a different card. |
| `E000010` | **Error - Card BIN Country Blocked** — The card's issuing country is blocked. | Card's country is restricted. |
| `E000011` | **Error - Country Blocked** — The transaction country is blocked. | Transaction not allowed from this country. |
| `E000012` | **Error - Blacklisted** — The card or customer is blacklisted. | Do not retry. Contact support if needed. |
| `E000013` | **Error - Undefined** — An undefined error occurred. | Contact Payzink support. |

### Handling error codes

```javascript
function getErrorMessage(statusCode) {
  const messages = {
    E000000: "A processing error occurred. Please try again.",
    E000001: "Verification failed. Please try again.",
    E000002: "Invalid verification code. Please try again.",
    E000003: "Verification timed out. Please try again.",
    E000004: "Invalid card number. Please check and try again.",
    E000005: "Insufficient funds. Please use a different card.",
    E000006: "This card cannot be used. Please use a different card.",
    E000007: "Your card has expired. Please use a different card.",
    E000008: "Invalid security code. Please check and try again.",
    E000009: "This card is not accepted. Please use a different card.",
    E000010: "This card is not accepted from your region.",
    E000011: "Transactions from your country are not supported.",
    E000012: "This card has been blocked. Please contact support.",
    E000013: "An unexpected error occurred. Please try again later.",
  };
  return messages[statusCode] || "Payment failed. Please try again.";
}
```

:::warning Do not retry certain errors
Never automatically retry these error codes: `E000004`, `E000006`, `E000007`, `E000009`, `E000010`, `E000011`, `E000012`. These indicate permanent issues with the card or configuration.
:::

## Fraud / Risk codes

| Status Code | Description | Suggested Action |
|-------------|-------------|------------------|
| `F000000` | **Error - Fraud** — Transaction flagged as fraudulent. | Do not retry. Do not process. |
| `F000001` | **Error - Fraud High Risk** — High-risk fraud assessment. | Do not retry. Block the request. |
| `F000002` | **Error - Fraud Elevated Risk** — Elevated risk detected. | Review manually or reject. |

### Handling fraud codes

```javascript
if (statusCode.startsWith("F")) {
  // Fraud detected — do not process
  logFraudAttempt(reference, statusCode);
  showMessage("This transaction could not be processed for security reasons.");
  // Do NOT retry fraud-flagged transactions
}
```

:::danger Fraud handling
Never retry transactions flagged with fraud codes (`F000000`, `F000001`, `F000002`). These should be logged, and the transaction should be terminated immediately. Repeatedly retrying fraud-flagged transactions may result in account suspension.
:::

## HTTP status codes

In addition to the Payzink status codes above, the API also returns standard HTTP status codes:

| HTTP Code | Description |
|-----------|-------------|
| `200` | Request succeeded. |
| `201` | Resource created. |
| `400` | Bad request — invalid parameters. |
| `401` | Unauthorized — invalid or expired token. |
| `403` | Forbidden — insufficient permissions. |
| `404` | Not found — resource doesn't exist. |
| `409` | Conflict — invalid state for operation. |
| `422` | Unprocessable — validation failed or payment declined. |
| `429` | Too many requests — rate limit exceeded. |
| `500` | Internal server error. |

## Next steps

- **[Payment States](/payment-lifecycle/payment-states)** — Understand the payment lifecycle.
- **[Error Handling](/api-reference/error-handling)** — Best practices for handling errors.

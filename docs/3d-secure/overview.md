---
sidebar_position: 1
title: Overview
description: Understanding 3D Secure authentication in Payzink payments.
---

# 3D Secure

3D Secure (3DS) is an authentication protocol that adds an extra layer of security for online card payments. It helps reduce fraud and shifts liability from the merchant to the card issuer.

## What is 3D Secure?

3D Secure is a protocol developed by card networks:
- **Visa:** Verified by Visa / Visa Secure
- **Mastercard:** Mastercard Identity Check (formerly SecureCode)
- **American Express:** SafeKey

When 3DS is triggered, the customer is asked to verify their identity with their issuing bank — typically through a one-time password (OTP), biometric authentication, or an app-based confirmation.

## 3DS 2.x vs 3DS 1.x

Payzink uses **3DS 2.x**, which provides a better customer experience compared to the older 3DS 1.x:

| Feature | 3DS 1.x | 3DS 2.x |
|---------|---------|---------|
| User experience | Always redirects to bank page | Can be frictionless (no redirect) |
| Mobile support | Poor | Optimized |
| Data sharing | Minimal | Rich data for risk assessment |
| Authentication | Password only | Biometrics, app-based, OTP |

## Authentication flows

### Frictionless flow

When the issuing bank has enough data to authenticate the customer without interaction:

```
Customer → Merchant → Payzink → Bank
                                  ↓
                          Risk assessment
                                  ↓
                         Low risk → Approved
                                  ↓
Customer ← Merchant ← Payzink ← Bank
```

The payment completes without any customer interaction. This provides the best user experience.

### Challenge flow

When the bank requires additional verification:

```
Customer → Merchant → Payzink → Bank
                                  ↓
                          Risk assessment
                                  ↓
                       High risk → Challenge required
                                  ↓
Customer is redirected to bank's authentication page
                                  ↓
Customer enters OTP / biometric / app confirmation
                                  ↓
Customer ← Merchant ← Payzink ← Bank (authenticated)
```

## Liability shift

When 3DS authentication is successful, the **liability for fraudulent chargebacks shifts from the merchant to the card issuer**. This means:

- If a 3DS-authenticated transaction is later disputed as fraudulent, the issuing bank bears the cost, not you.
- This applies even for frictionless flows where the bank chose not to challenge the customer.

## When is 3DS triggered?

3DS may be triggered based on:

| Factor | Description |
|--------|-------------|
| **Issuer rules** | The customer's bank may require 3DS for all transactions. |
| **Transaction amount** | Higher amounts are more likely to trigger 3DS. |
| **Regulation** | PSD2/SCA in Europe mandates 3DS for most transactions. |
| **Risk signals** | Unusual purchase patterns, new card, high-risk merchant category. |

## Hosted Payment Page

If you're using the **Hosted Payment Page**, 3D Secure is **handled automatically**. Payzink manages the entire 3DS flow on `payment.payzink.com` — you don't need to implement anything.

## Direct API

If you're using the **Direct API**, you need to handle the 3DS redirect. When a payment returns `statusCode: "S01"` with `state: "AWAIT_3DS"`, redirect the customer to the 3DS URL on `payment.payzink.com/3ds/{reference}`.

See [3D Secure Integration](/3d-secure/integration) for implementation details.

## Next steps

- **[3D Secure Integration](/3d-secure/integration)** — Implement 3DS in your Direct API integration.
- **[Test Cards](/getting-started/test-cards)** — Test 3DS flows in the sandbox.

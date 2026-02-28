---
sidebar_position: 4
title: Test Cards
description: Use these test card numbers to simulate different payment scenarios in the sandbox.
---

# Test Cards

Use the following card numbers in the sandbox environment to simulate different payment outcomes. These cards only work with the sandbox API (`merchant-dev.payzink.com`).

For all test cards, use:
- **Expiry date:** Any future date (e.g., `12/27`)
- **CVV:** Any 3-digit number (e.g., `123`), or 4 digits for AMEX (e.g., `1234`)
- **Cardholder name:** Any name

## Successful payments

| Card Network | Card Number | Behavior |
|---|---|---|
| Visa | `4111 1111 1111 1111` | Payment approved |
| Visa | `4012 0000 0000 0081` | Payment approved (debit card) |
| Mastercard | `5200 0000 0000 0007` | Payment approved |
| Mastercard | `5100 0000 0000 0008` | Payment approved (debit card) |
| American Express | `3700 0000 0000 002` | Payment approved |

## Declined payments

| Card Number | Decline Reason | Status Code |
|---|---|---|
| `4000 0000 0000 0002` | Insufficient funds | `E000005` |
| `4000 0000 0000 0010` | Card expired | `E000007` |
| `4000 0000 0000 0028` | Do not honour | `E000000` |
| `4000 0000 0000 0036` | Invalid card number | `E000004` |
| `4000 0000 0000 0044` | Lost or stolen card | `E000006` |
| `4000 0000 0000 0051` | Exceeds withdrawal limit | `E000005` |
| `5000 0000 0000 0009` | Generic decline (Mastercard) | `E000000` |

## 3D Secure test cards

| Card Number | 3DS Behavior |
|---|---|
| `4000 0000 0000 3220` | 3DS2 — challenge flow (requires authentication) |
| `4000 0000 0000 3238` | 3DS2 — frictionless flow (auto-approved) |
| `4000 0000 0000 3246` | 3DS2 — authentication failed |
| `4000 0000 0000 3253` | 3DS2 — challenge flow, then timeout |

### 3D Secure challenge credentials

When redirected to the 3D Secure challenge page in the sandbox, use the following credentials:

| Field | Value |
|-------|-------|
| OTP / Password | `Checkout1!` |

## Error simulation cards

| Card Number | Simulated Error |
|---|---|
| `4000 0000 0000 0069` | Gateway timeout |
| `4000 0000 0000 0077` | Processing error |

## Tips for testing

:::tip Best practices
1. **Test all scenarios** — Don't just test the happy path. Test declines, 3DS, and error cases.
2. **Check webhooks** — Verify that your webhook handler processes all event types correctly.
3. **Test idempotency** — Send the same request twice to ensure you handle duplicates properly.
4. **Verify amounts** — Test with different amounts and currencies.
5. **Test refund flows** — After a successful payment, test full and partial refunds.
:::

## Next steps

- **[Quick Start Guide](/getting-started/quick-start)** — Process your first test payment.
- **[Going Live](/getting-started/going-live)** — Prepare your integration for production.

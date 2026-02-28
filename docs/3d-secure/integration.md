---
sidebar_position: 2
title: Integration
description: How to implement 3D Secure authentication with the Payzink Direct API.
---

# 3D Secure Integration

This guide explains how to handle 3D Secure authentication when using the Direct API.

:::info HPP users
If you're using the Hosted Payment Page, 3DS is handled automatically. This guide is only for Direct API integrations.
:::

## Integration flow

```
┌──────────┐         ┌──────────┐         ┌─────────────────────┐
│ Customer │         │   Your   │         │ merchant.payzink.com│
│ Browser  │         │  Server  │         │ payment.payzink.com │
└────┬─────┘         └────┬─────┘         └────────┬────────────┘
     │ 1. Submit order     │                        │
     │ ──────────────────► │                        │
     │                     │ 2. POST /payment/card  │
     │                     │ ──────────────────────►│
     │                     │ 3. AWAIT_3DS response  │
     │                     │ ◄──────────────────────│
     │ 4. Redirect to 3DS  │                        │
     │ ◄────────────────── │                        │
     │                     │                        │
     │ 5. Customer authenticates on payment.payzink.com/3ds/{ref}
     │ ────────────────────────────────────────────►│
     │                     │                        │
     │ 6. 3DS callback to payment domain            │
     │ ◄───────────────────────────────────────────►│
     │                     │                        │
     │ 7. Redirect to your callbackUrl              │
     │ ──────────────────► │                        │
     │                     │ 8. GET /transaction/info│
     │                     │ ──────────────────────►│
     │                     │ 9. Final state         │
     │                     │ ◄──────────────────────│
     │ 10. Show result     │                        │
     │ ◄────────────────── │                        │
```

## Step-by-step implementation

### Step 1: Send the payment request

Include a `callbackUrl` in `_links` to receive the 3DS redirect:

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/payment/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 5000
      }
    },
    "payment": {
      "pan": "4000000000003220",
      "expiryYear": "2027",
      "expiryMonth": "12",
      "cvv": "123",
      "cardHolderName": "Ahmed Al Maktoum"
    },
    "customer": {
      "email": "ahmed@example.com",
      "ip": "81.214.125.134"
    },
    "_links": {
      "callbackUrl": "https://yoursite.com/3ds-callback",
      "notificationUrl": "https://yoursite.com/webhooks/payzink"
    }
  }'
```

### Step 2: Check for 3DS requirement

If the response has `state: "AWAIT_3DS"`, 3DS authentication is required. The 3DS URL is in `result._links["payment:3ds"].href`:

```json
{
  "meta": {
    "requestId": "payzink-REQ-eca29fd6-7413-4e21-b3d2-a7d27eeb2e5a"
  },
  "result": {
    "reference": "1325ce74-4f82-4394-a25d-67a9333e5b24",
    "paymentDetail": {
      "pan": "4000********3220",
      "expiryMonth": "***",
      "expiryYear": "2027",
      "cvv": "***",
      "brand": "VISA",
      "cardHolderName": "Ahmed Al Maktoum"
    },
    "mid": 1,
    "state": "AWAIT_3DS",
    "merchantName": "Your Merchant Name",
    "order": {
      "action": "PURCHASE",
      "amount": {
        "currencyCode": "AED",
        "value": 5000
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

### Step 3: Redirect to the 3DS page

Redirect the customer to the 3DS URL on the **payment domain**:

```javascript
app.post("/checkout", async (req, res) => {
  const { result } = await createCardPayment(req.body);

  if (result.state === "AWAIT_3DS") {
    req.session.paymentReference = result.reference;
    res.redirect(result._links["payment:3ds"].href);
  } else if (result.state === "PURCHASED") {
    res.redirect("/payment/success");
  } else {
    res.redirect("/payment/failed");
  }
});
```

### Step 4: Handle the callback

After 3DS authentication, the customer is redirected to your `_links.callbackUrl`:

```javascript
app.get("/3ds-callback", async (req, res) => {
  const reference = req.query.ref || req.session.paymentReference;
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://merchant-dev.payzink.com/api/v1/payment/transaction/${reference}/info`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const { result } = await response.json();

  if (result.state === "PURCHASED" || result.state === "AUTHORISED") {
    res.render("success", { payment: result });
  } else if (result.state === "FAILED") {
    res.render("failed", { message: result.statusMessage });
  } else {
    res.render("pending", { payment: result });
  }
});
```

## 3DS-related status codes

| Status Code | Meaning | Action |
|-------------|---------|--------|
| `S01` | 3DS required | Redirect customer to `_links["payment:3ds"].href` |
| `S00` | 3DS passed, payment successful | Fulfill order |
| `E000001` | 3DS processing error | Ask customer to retry |
| `E000002` | Invalid 3DS PIN/OTP | Ask customer to retry |
| `E000003` | 3DS timeout | Ask customer to retry |

## Testing 3DS

Use these [test cards](/getting-started/test-cards) in the sandbox:

| Card | Behavior |
|------|----------|
| `4000 0000 0000 3220` | Challenge flow (requires authentication) |
| `4000 0000 0000 3238` | Frictionless flow (auto-approved) |
| `4000 0000 0000 3246` | Authentication failed |
| `4000 0000 0000 3253` | Challenge timeout |

When redirected to the sandbox 3DS challenge page, use password: `Checkout1!`

## Next steps

- **[Payment States](/payment-lifecycle/payment-states)** — Understand all payment states.
- **[Status Codes](/payment-lifecycle/status-codes)** — Full status code reference.

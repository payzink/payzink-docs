---
sidebar_position: 4
title: Request Payment from Customer
description: How to redirect your customer to the Payzink Hosted Payment Page.
---

# Request Payment from Customer

After creating a hosted payment, redirect your customer to the checkout URL provided in `result._links.payment.href`.

## Redirect methods

### Server-side redirect (recommended)

```javascript
// Express.js
app.post("/checkout", async (req, res) => {
  const { result } = await createHostedPayment(req.body);
  res.redirect(303, result._links.payment.href);
});
```

```php
// PHP
$data = createHostedPayment($paymentData);
$checkoutUrl = $data['result']['_links']['payment']['href'];
header('Location: ' . $checkoutUrl, true, 303);
exit;
```

### Client-side redirect

```javascript
const response = await fetch("/api/create-payment", {
  method: "POST",
  body: JSON.stringify(paymentData),
});
const { result } = await response.json();
window.location.href = result._links.payment.href;
```

:::caution Avoid iframes
Do not embed the payment page in an iframe. Most card networks and banks block payment pages in iframes for security reasons, and 3D Secure challenges will not work properly.
:::

## Handling the redirect back

### Successful payment

The customer is redirected to your site with the transaction reference:

```
https://yoursite.com/payment/complete?ref=02204c33-a250-45f2-ac73-3714acd6cbb1
```

### Cancelled payment

If the customer cancels, they are redirected to your `cancelUrl`:

```
https://yoursite.com/payment/cancel?ref=02204c33-a250-45f2-ac73-3714acd6cbb1
```

## Important: Always verify server-side

:::danger Never trust the redirect alone
The redirect URL can be manipulated by the customer. **Always** call the [Retrieve Transaction Info](/hosted-payment-page/retrieve-transaction) endpoint from your server to verify the payment state before fulfilling an order.
:::

```javascript
app.get("/payment/complete", async (req, res) => {
  const reference = req.query.ref;
  const { result } = await getTransactionInfo(reference);

  switch (result.state) {
    case "PURCHASED":
      await fulfillOrder(reference);
      res.render("success", { payment: result });
      break;
    case "AUTHORISED":
      res.render("authorized", { payment: result });
      break;
    case "FAILED":
      res.render("failed", { payment: result });
      break;
    default:
      res.render("pending", { payment: result });
  }
});
```

## Checkout URL expiry

The checkout URL (`_links.payment.href`) is valid for **30 minutes** after the payment is created. If the customer doesn't complete payment within this window, the transaction expires and a new one must be created.

## Next steps

- **[Retrieve Transaction Info](/hosted-payment-page/retrieve-transaction)** — Verify the payment result.
- **[Webhooks](/webhooks/overview)** — Receive notifications for reliable payment confirmation.

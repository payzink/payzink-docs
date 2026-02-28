---
sidebar_position: 3
title: Security
description: How to verify Payzink webhook signatures for secure event processing.
---

# Webhook Security

Every webhook notification from Payzink includes a cryptographic signature that you must verify to ensure the request is authentic and hasn't been tampered with.

## How signing works

Payzink signs each webhook using your **Secret Key** (`sk_live_...` or `sk_test_...`) and sends the following headers:

| Header | Description |
|--------|-------------|
| `X-Payzink-Timestamp` | Unix timestamp (seconds) when the webhook was sent. |
| `X-Payzink-Signature` | HMAC-SHA256 hex digest of `timestamp + rawPayload`. |
| `X-Payzink-Signature-Version` | Signature version (currently `v1`). |
| `X-Payzink-Signature-Algorithm` | Hash algorithm (`sha256`). |
| `X-Payzink-Signature-Digest` | SHA-256 hash of the raw JSON payload body. |

### Signature computation

The signature is computed as:

```
HMAC-SHA256(timestamp + rawPayload, secretKey)
```

Where:
- **`timestamp`** is the value of the `X-Payzink-Timestamp` header (Unix seconds)
- **`rawPayload`** is the raw JSON request body as a string
- **`secretKey`** is your merchant Secret Key (the same `sk_live_...` / `sk_test_...` you use for authentication)

:::warning Use the raw body
You must use the **raw** request body string for signature verification, not a re-serialized version. JSON re-serialization may change key ordering or whitespace, causing signature mismatches.
:::

## Verification steps

1. Extract the `X-Payzink-Timestamp` and `X-Payzink-Signature` headers.
2. Get the **raw** request body as a string.
3. Compute `HMAC-SHA256(timestamp + rawBody, secretKey)`.
4. Compare the computed value with `X-Payzink-Signature` using a timing-safe comparison.
5. Check that the timestamp is recent (within 5 minutes) to prevent replay attacks.

## Implementation examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="node" label="Node.js" default>

```javascript
import crypto from "crypto";

function verifyWebhookSignature(rawPayload, timestamp, signature, secretKey) {
  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(timestamp + rawPayload)
    .digest("hex");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );

  const now = Math.floor(Date.now() / 1000);
  const isFresh = Math.abs(now - parseInt(timestamp)) < 300;

  return isValid && isFresh;
}

// Express middleware — use express.raw() to get the raw body
app.post(
  "/webhooks/payzink",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const timestamp = req.headers["x-payzink-timestamp"];
    const signature = req.headers["x-payzink-signature"];
    const rawPayload = req.body.toString();

    if (
      !verifyWebhookSignature(
        rawPayload,
        timestamp,
        signature,
        process.env.SECRET_KEY
      )
    ) {
      return res.status(401).send("Invalid signature");
    }

    const payload = JSON.parse(rawPayload);
    console.log(`Event: ${payload.event}, Reference: ${payload.data.reference}`);

    // Process event...
    res.status(200).send("OK");
  }
);
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function verifyWebhookSignature(
    string $rawPayload,
    string $timestamp,
    string $signature,
    string $secretKey
): bool {
    $expected = hash_hmac('sha256', $timestamp . $rawPayload, $secretKey);

    if (!hash_equals($expected, $signature)) {
        return false;
    }

    $now = time();
    if (abs($now - (int) $timestamp) > 300) {
        return false;
    }

    return true;
}

// Usage
$rawPayload = file_get_contents('php://input');
$timestamp = $_SERVER['HTTP_X_PAYZINK_TIMESTAMP'] ?? '';
$signature = $_SERVER['HTTP_X_PAYZINK_SIGNATURE'] ?? '';
$secretKey = getenv('SECRET_KEY'); // sk_live_... or sk_test_...

if (!verifyWebhookSignature($rawPayload, $timestamp, $signature, $secretKey)) {
    http_response_code(401);
    exit('Invalid signature');
}

$payload = json_decode($rawPayload, true);
$event = $payload['event'];
$data = $payload['data'];

// Process event...
http_response_code(200);
echo 'OK';
```

</TabItem>
<TabItem value="python" label="Python">

```python
import hmac
import hashlib
import time
import os

def verify_webhook_signature(
    raw_payload: bytes,
    timestamp: str,
    signature: str,
    secret_key: str,
) -> bool:
    message = timestamp.encode() + raw_payload
    expected = hmac.new(
        secret_key.encode(),
        message,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected, signature):
        return False

    now = int(time.time())
    if abs(now - int(timestamp)) > 300:
        return False

    return True

# Flask example
from flask import Flask, request

app = Flask(__name__)

@app.route("/webhooks/payzink", methods=["POST"])
def handle_webhook():
    timestamp = request.headers.get("X-Payzink-Timestamp", "")
    signature = request.headers.get("X-Payzink-Signature", "")
    raw_payload = request.data

    if not verify_webhook_signature(
        raw_payload, timestamp, signature, os.environ["SECRET_KEY"]
    ):
        return "Invalid signature", 401

    payload = request.json
    event = payload["event"]
    data = payload["data"]

    print(f"Event: {event}, Reference: {data['reference']}")

    # Process event...
    return "OK", 200
```

</TabItem>
</Tabs>

:::danger Always verify signatures
Never process webhook events without verifying the signature. An attacker could send fake webhook notifications to your endpoint, causing you to fulfill orders that were never paid for.
:::

## Additional verification with `X-Payzink-Signature-Digest`

For extra security, you can also verify the `X-Payzink-Signature-Digest` header, which is a plain SHA-256 hash of the raw payload body:

```javascript
const payloadDigest = crypto.createHash("sha256").update(rawPayload).digest("hex");
const receivedDigest = req.headers["x-payzink-signature-digest"];

if (payloadDigest !== receivedDigest) {
  return res.status(401).send("Payload tampered");
}
```

## Replay attack protection

The `X-Payzink-Timestamp` header helps protect against replay attacks. Reject any webhook where the timestamp is more than 5 minutes old:

```javascript
const MAX_AGE_SECONDS = 300; // 5 minutes
const now = Math.floor(Date.now() / 1000);
const webhookTimestamp = parseInt(req.headers["x-payzink-timestamp"]);

if (Math.abs(now - webhookTimestamp) > MAX_AGE_SECONDS) {
  return res.status(401).send("Webhook too old");
}
```

## Next steps

- **[Best Practices](/webhooks/best-practices)** — Production-ready webhook handling.

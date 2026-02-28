---
sidebar_position: 5
title: BIN Lookup
description: API reference for looking up card BIN information.
---

# BIN Lookup

<span class="badge badge--post">POST</span> `/api/v1/bin/info`

Retrieve card information from a Bank Identification Number (BIN). The BIN is the first 6–8 digits of a card number.

## Endpoint

| Environment | URL |
|-------------|-----|
| Sandbox | `https://merchant-dev.payzink.com/api/v1/bin/info` |
| Production | `https://merchant.payzink.com/api/v1/bin/info` |

## Request

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes |

### Body parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bin` | `string` | Yes | First 6–8 digits of the card number. |

### Example request

```json
{
  "bin": "979200"
}
```

## Response

### Success — `200 OK`

```json
{
  "result": {
    "bin": "979200",
    "cardNetwork": "VISA",
    "cardType": "CREDIT",
    "issuingBank": "Example Bank",
    "issuingCountry": "TR",
    "issuingCountryName": "Turkey"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `result.bin` | `string` | The queried BIN. |
| `result.cardNetwork` | `string` | Card network (`VISA`, `MASTERCARD`, `AMEX`). |
| `result.cardType` | `string` | Card type (`CREDIT`, `DEBIT`, `PREPAID`). |
| `result.issuingBank` | `string` | Name of the issuing bank. |
| `result.issuingCountry` | `string` | ISO 3166-1 alpha-2 country code. |
| `result.issuingCountryName` | `string` | Full country name. |

## Code examples

```bash
curl -X POST https://merchant-dev.payzink.com/api/v1/bin/info \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{"bin": "979200"}'
```

## Next steps

- **[Payment with Credit Card](/direct-api/payment-credit-card)** — Process a card payment.

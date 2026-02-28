---
sidebar_position: 1
title: Endpoints
description: Complete list of all Payzink API endpoints.
---

# API Endpoints

A complete reference of all available Payzink API endpoints.

## Domains

| Environment | Merchant API | Payment Domain |
|-------------|-------------|----------------|
| Sandbox | `https://merchant-dev.payzink.com` | `https://payment-dev.payzink.com` |
| Production | `https://merchant.payzink.com` | `https://payment.payzink.com` |

## Authentication

| Method | Endpoint | Description | Reference |
|--------|----------|-------------|-----------|
| <span class="badge badge--post">POST</span> | `/api/v1/auth/access-token` | Request an access token | [Docs](/authentication/access-token) |

## Hosted Payment Page

| Method | Endpoint | Description | Reference |
|--------|----------|-------------|-----------|
| <span class="badge badge--post">POST</span> | `/api/v1/payment/hosted` | Create a hosted payment | [Docs](/hosted-payment-page/create-hosted-payment) |

## Direct API — Payments

| Method | Endpoint | Description | Reference |
|--------|----------|-------------|-----------|
| <span class="badge badge--post">POST</span> | `/api/v1/payment/init` | Initialize a payment | [Docs](/direct-api/payment-initialization) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/card` | Card payment | [Docs](/direct-api/payment-credit-card) |
| <span class="badge badge--post">POST</span> | `/api/v1/bin/info` | BIN lookup | [Docs](/direct-api/bin-lookup) |

## Transaction Management

| Method | Endpoint | Description | Reference |
|--------|----------|-------------|-----------|
| <span class="badge badge--get">GET</span> | `/api/v1/payment/transaction/{reference}/info` | Get transaction info | [Docs](/direct-api/transaction-info) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{reference}/capture` | Capture a payment | [Docs](/direct-api/capture) |
| <span class="badge badge--delete">DELETE</span> | `/api/v1/payment/transaction/{reference}/cancel` | Cancel/void a transaction | [Docs](/direct-api/cancel-transaction) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{reference}/refund` | Refund a transaction | [Docs](/direct-api/refund-transaction) |
| <span class="badge badge--delete">DELETE</span> | `/api/v1/payment/transaction/{ref}/action/{action_ref}/cancel` | Cancel a specific action | [Docs](/direct-api/cancel-action) |
| <span class="badge badge--post">POST</span> | `/api/v1/payment/transaction/{ref}/action/{action_ref}/refund` | Refund a specific action | [Docs](/direct-api/refund-action) |

## Payment Domain (Customer-facing)

These endpoints are on the **payment domain** and are used for customer-facing flows:

| Method | Domain | Path | Description |
|--------|--------|------|-------------|
| <span class="badge badge--get">GET</span> | `payment.payzink.com` | `/checkout/{reference}` | Hosted checkout page |
| <span class="badge badge--get">GET</span> | `payment.payzink.com` | `/checkout/result` | Checkout result page |
| <span class="badge badge--get">GET</span> | `payment.payzink.com` | `/3ds/{reference}` | 3D Secure authentication page |

## Common headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer {accessToken}` | Yes |
| `Content-Type` | `application/json` | Yes (POST/DELETE with body) |
| `Accept` | `application/json` | Recommended |

## Rate limits

| Endpoint | Limit |
|----------|-------|
| `POST /api/v1/auth/access-token` | 60 requests/minute |
| All other endpoints | 120 requests/minute |

## Next steps

- **[Error Handling](/api-reference/error-handling)** — Understand error responses.
- **[Status Codes](/payment-lifecycle/status-codes)** — Payzink status code reference.

---
sidebar_position: 5
title: Going Live
description: Checklist and requirements for moving your Payzink integration to production.
---

# Going Live

Once you've thoroughly tested your integration in the sandbox, follow this checklist to go live with real payments.

## Pre-launch checklist

### 1. Business onboarding

Your business must be approved by the Payzink onboarding team. You may need to provide:

- Business website with a clear product or service description
- Valid business bank account details for settlements
- Corporate documentation (e.g., trade license, proof of registration)
- Identification for authorized representatives
- Proof of address

Your relationship manager will guide you through any KYC (Know Your Customer) requirements specific to your region.

### 2. Production credentials

Once onboarded, you'll receive production API credentials:

1. Log in to [console.payzink.com](https://console.payzink.com).
2. Navigate to **Settings → API Credentials**.
3. Generate your production **Publishable Key** and **Secret Key**.
4. Store them securely using environment variables or a secrets manager.

:::danger Never hardcode credentials
Do not hardcode production credentials in your source code. Use environment variables or a secure secrets management service.
:::

### 3. Update domains

Replace all sandbox domains with production domains:

| Setting | Sandbox | Production |
|---------|---------|------------|
| Merchant API | `https://merchant-dev.payzink.com` | `https://merchant.payzink.com` |
| Payment Domain | `https://payment-dev.payzink.com` | `https://payment.payzink.com` |
| Dashboard | `https://console-dev.payzink.com` | `https://console.payzink.com` |

### 4. Configure webhooks

1. In the production dashboard, go to **Settings → Webhooks**.
2. Enter your production webhook endpoint URL.
3. Save the webhook signing secret.
4. Ensure your endpoint is publicly accessible and returns a `200 OK` response.

### 5. Security checklist

| Requirement | Details |
|---|---|
| **HTTPS** | All communication must use TLS 1.2 or higher |
| **Credential storage** | API keys stored in environment variables or secrets manager |
| **Webhook verification** | Verify webhook signatures on every notification |
| **PCI DSS** | HPP: SAQ-A compliant. Direct API: SAQ-D compliant |
| **IP whitelisting** | Optional — restrict API access to known IP addresses |

### 6. Integration verification

Before going live, verify that your integration handles all critical scenarios:

- [ ] Successful payments (purchase and authorization)
- [ ] Declined payments (show appropriate error to customer)
- [ ] 3D Secure challenge flow
- [ ] Webhook receipt and processing
- [ ] Capture of authorized payments
- [ ] Full and partial refunds
- [ ] Void / reversal of authorizations
- [ ] Token expiry and renewal
- [ ] Network errors and timeouts (with retry logic)
- [ ] Idempotent request handling

### 7. Go live

Once all items are checked:

1. Deploy your production code with production credentials and domains.
2. Process a small real transaction to verify end-to-end.
3. Monitor the [Payzink Dashboard](https://console.payzink.com) for transaction status.
4. Notify your relationship manager that you're live.

## Support

If you encounter any issues during the go-live process:

- Email the integration team: [developer@payzink.com](mailto:developer@payzink.com)
- Contact your relationship manager for account-related questions.

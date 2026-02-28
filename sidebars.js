/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/introduction",
        "getting-started/quick-start",
        "getting-started/sandbox",
        "getting-started/test-cards",
        "getting-started/going-live",
      ],
    },
    {
      type: "category",
      label: "Authentication",
      collapsed: true,
      items: [
        "authentication/overview",
        "authentication/access-token",
      ],
    },
    {
      type: "category",
      label: "Hosted Payment Page",
      collapsed: true,
      items: [
        "hosted-payment-page/overview",
        "hosted-payment-page/getting-started",
        "hosted-payment-page/create-hosted-payment",
        "hosted-payment-page/request-payment",
        "hosted-payment-page/retrieve-transaction"
      ],
    },
    {
      type: "category",
      label: "Direct API",
      collapsed: true,
      items: [
        "direct-api/overview",
        "direct-api/getting-started",
        "direct-api/payment-initialization",
        "direct-api/payment-credit-card",
        "direct-api/bin-lookup",
        "direct-api/capture",
        "direct-api/cancel-transaction",
        "direct-api/refund-transaction",
        "direct-api/cancel-action",
        "direct-api/refund-action",
        "direct-api/transaction-info",
      ],
    },
    {
      type: "category",
      label: "Webhooks",
      items: [
        "webhooks/overview",
        "webhooks/events",
        "webhooks/security",
        "webhooks/best-practices",
      ],
    },
    {
      type: "category",
      label: "3D Secure",
      items: [
        "3d-secure/overview",
        "3d-secure/integration",
      ],
    },
    {
      type: "category",
      label: "Payment Lifecycle",
      items: [
        "payment-lifecycle/payment-states",
        "payment-lifecycle/status-codes",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: [
        "api-reference/endpoints",
        "api-reference/error-handling",
      ],
    },
  ],
};

module.exports = sidebars;

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "dz-enterprise-api",
    },
    {
      type: "category",
      label: "Accounts",
      link: {
        type: "doc",
        id: "accounts",
      },
      items: [
        {
          type: "doc",
          id: "list-accounts",
          label: "List accounts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-account",
          label: "Create account",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-account",
          label: "Get account by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-account",
          label: "Update account",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-account",
          label: "Remove account",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Portfolios",
      link: {
        type: "doc",
        id: "portfolios",
      },
      items: [
        {
          type: "doc",
          id: "list-portfolios",
          label: "List portfolios",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-portfolio",
          label: "Create portfolio",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-portfolio",
          label: "Get portfolio by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-portfolio",
          label: "Update portfolio",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-portfolio",
          label: "Remove portfolio",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Custodians",
      link: {
        type: "doc",
        id: "custodians",
      },
      items: [
        {
          type: "doc",
          id: "list-custodians",
          label: "List custodians",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-custodian",
          label: "Create custodian",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-custodian",
          label: "Get custodian by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-custodian",
          label: "Update custodian",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-custodian",
          label: "Remove custodian",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Transactions",
      link: {
        type: "doc",
        id: "transactions",
      },
      items: [
        {
          type: "doc",
          id: "list-transactions",
          label: "List transactions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-transaction",
          label: "Create transaction",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-transaction",
          label: "Get transaction by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-transaction",
          label: "Update transaction",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-transaction",
          label: "Remove transaction",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Payments",
      link: {
        type: "doc",
        id: "payments",
      },
      items: [
        {
          type: "doc",
          id: "list-payments",
          label: "List payments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-payment",
          label: "Create payment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-payment",
          label: "Get payment by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-payment",
          label: "Update payment",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-payment",
          label: "Remove payment",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Credit Agreements",
      link: {
        type: "doc",
        id: "credit-agreements",
      },
      items: [
        {
          type: "doc",
          id: "list-agreements",
          label: "List credit agreements",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "create-agreement",
          label: "Create credit agreement",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "get-agreement",
          label: "Get credit agreement by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "update-agreement",
          label: "Update credit agreement",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "remove-agreement",
          label: "Remove credit agreement",
          className: "api-method delete",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;

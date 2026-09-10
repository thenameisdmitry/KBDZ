# Dmitrii Zhukov — Senior Technical Writer Portfolio

A personal portfolio website built to demonstrate my skills in technical writing, API documentation, and knowledge management in a fintech B2B SaaS context.

**Live site:** [thenameisdmitry.github.io/KBDZ](https://thenameisdmitry.github.io/KBDZ/)

---

## What's inside

| Section | Description |
|---|---|
| **Home** | Introduction, professional summary, and navigation |
| **Documentation Portfolio** | Five knowledge base case studies from enterprise fintech, plus release notes, automation scripts, and an interactive pipeline simulator |
| **API Documentation** | Hand-written REST reference covering authentication, conventions, errors, Accounts, Portfolios, Transactions, and Credit Agreements |
| **API Specification** | The same API as a machine-readable OpenAPI 3.0 contract, with reference pages generated from it |
| **Blog** | Articles on technical writing, AI workflows, and documentation strategy |
| **My Expertise** | Skills, tools, domain knowledge, key achievements, and availability |

---

## How to view the portfolio

Simply open the live site:

```
https://thenameisdmitry.github.io/KBDZ/
```

No installation required. The site works in any modern browser.

---

## Built with

| Tool | Purpose |
|---|---|
| [Docusaurus 3](https://docusaurus.io/) | Static site generator: docs, blog, and page routing |
| React + TypeScript | Custom page components and interactive elements |
| MDX | Documentation pages with embedded React components |
| OpenAPI 3.0 | API contract at `static/openapi/dz-api.yaml` |
| [docusaurus-plugin-openapi-docs](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs) | Generates the reference under `/api/specification` from that contract |
| [@easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local) | Offline full-text search, no external service |
| GitHub Pages | Hosting and deployment |
| Git + GitHub | Version control |

### AI tools used in development

| Tool | Role |
|---|---|
| [Claude (Anthropic)](https://claude.ai/) | Primary development assistant: component architecture, CSS, deployment, debugging |
| [ChatGPT (OpenAI)](https://chat.openai.com/) | Secondary assistant for content drafting and wording |

---

## Run locally

```bash
# Clone the repository
git clone https://github.com/thenameisdmitry/KBDZ.git
cd KBDZ

# Install dependencies
npm install

# Start development server
npm run start
```

The site will be available at `http://localhost:3000/KBDZ/`.

---

## Regenerating the API reference

The pages under `/api/specification` are generated from the OpenAPI contract and
committed to the repository. After editing `static/openapi/dz-api.yaml`, run:

```bash
npm run clean-api   # remove the previously generated MDX
npm run gen-api     # regenerate from the spec
npm run build       # verify
```

The hand-written reference under `/api` is maintained separately: it carries the
narrative, worked examples, and guidance that a generated reference cannot.

---

## Deploy

```bash
USE_SSH=true npm run deploy
```

Deploys to the `gh-pages` branch and publishes to GitHub Pages automatically.

---

## About

**Dmitrii Zhukov** — Senior Technical Writer and Documentation Product Lead with 10 years of experience in fintech, asset management, and B2B SaaS.

- LinkedIn: [linkedin.com/in/dmitrii-zhukov-71b94222b](https://www.linkedin.com/in/dmitrii-zhukov-71b94222b/)
- GitHub: [github.com/thenameisdmitry](https://github.com/thenameisdmitry/)
- Email: storiesbydz@gmail.com

<h2 align='center'>CrowdTrust App</h2>

<p align='center'>Web frontend, backend, and smart contracts for https://crowdtrust.app</p>

<br>

#### Prerequisites

- Install [PNPM](https://pnpm.io/)

#### Setup

```bash
# Clone monorepo
git clone git@github.com:CrowdTrustApp/crowdtrust-app

# Install packages
pnpm i
```

#### Run

** Launch stack or parts of it in a local k8s cluster:**

```bash
# Build backend apps for aarch64
$ npm run dev:build-aarch
# Start crowdtrust-api stack (Crowdtrust API + Postgres)
$ npm run skaffold:basic
```

```bash
# Run crowdtrust web app in development mode
npm run prod:web:run

# Run crowdtrust web admin
npm run prod:web-admin:run
```

**Build**

```bash
# Build crowdtrust web app for production
npm run prod:web:build

# Build crowdtrust web admin
npm run prod:web-admin:build
```

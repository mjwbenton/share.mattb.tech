# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal content sharing website (share.mattb.tech) built as a Yarn workspaces monorepo. The site has two deployment modes:
- **share.mattb.tech** - Public sharing site
- **lonesome.mattb.tech** - Private site with Cognito SSO authentication

## Common Commands

```bash
# Development
yarn install          # Install dependencies (Yarn 3.2.0)
yarn dev              # Start dev server on port 3000
yarn build            # Build all packages
yarn check            # Run linting/type checks across all packages
yarn fix              # Auto-fix formatting/linting

# Website-specific (run from packages/website or use yarn workspace)
yarn workspace @mattb.tech/lonesome-website codegen  # Generate GraphQL types

# Testing (run after deployment)
yarn site-test        # Run all tests (Cypress + Lighthouse + Pa11y)

# Deployment
yarn deploy           # Deploy to AWS using CDK
```

## Architecture

### Monorepo Packages

```
packages/
├── website/          # Next.js 14 main application (React 18, MDX, Tailwind)
├── cdk/              # AWS CDK infrastructure (CloudFront, S3, Route53, Cognito)
├── edge-router/      # Lambda@Edge: URL rewriting (.html, trailing slashes)
├── edge-auth/        # Lambda@Edge: Cognito authentication
├── remark-flickr/    # Remark plugin for Flickr photo integration
├── data-fetching/    # Remark plugin for build-time GraphQL data injection
├── cypress-tests/    # E2E tests
└── website-audits/   # Lighthouse & Pa11y audits
```

### Data Provider Pattern

Content features use a consistent pattern where Remark plugins inject data at build time:

```
packages/website/src/<feature>/
├── <name>DataProvider.ts    # Remark plugin for build-time data fetching
├── Component.tsx            # React component consuming the data
└── types.ts                 # Shared types
```

Features: reading, watching, playing, photos, activities, recordings, code, energy, climate

### Build Modes

The website builds twice with different configurations:
- `SHARE_MODE=false` → outputs to `out-lonesome/` (private, authenticated)
- `SHARE_MODE=true` → outputs to `out-share/` (public)

### Key Technologies

- **Next.js 14** with static export (no server-side rendering)
- **MDX** content with remark/rehype processing pipeline
- **Apollo Client** for GraphQL queries against api.mattb.tech
- **Tailwind CSS** with dark mode support (class-based via next-themes)
- **AWS CDK** for infrastructure-as-code deployment

### GraphQL Integration

Schema lives at `https://api.mattb.tech`. Run `yarn workspace @mattb.tech/lonesome-website codegen` to regenerate types in `packages/website/src/generated/graphql.tsx`.

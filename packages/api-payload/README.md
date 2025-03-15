# @acme/api-payload

This package integrates tRPC API functionality from the base API package with PayloadCMS.

## Features

- Extends the base API with PayloadCMS-specific functionality
- Provides a unified tRPC router that includes:
  - All base API routes
  - All PayloadCMS routes under the `payload` namespace
- Adds PayloadCMS authentication to the tRPC context

## Usage

### Installation

```bash
pnpm add @acme/api-payload
```

### In Your App

In your app's tRPC route handler:

```typescript
// apps/payload-web/src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api-payload";
import { auth } from "@acme/auth";

// ... your route handler code
```

### In Your Frontend

In your frontend components:

```tsx
"use client";

import { useTRPC } from "@/trpc/react";

export function MyComponent() {
  const trpc = useTRPC();

  // Access PayloadCMS routes
  const { data: users } = trpc.payload.users.find.useQuery({
    page: 1,
    limit: 10,
  });

  // Access base API routes
  const { data: posts } = trpc.post.all.useQuery();

  // ... rest of your component
}
```

## Development

To extend this package with additional functionality:

1. Add new routers in the `src/router/` directory
2. Update `src/root.ts` to include your new routers

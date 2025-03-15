# @acme/api-template

This is a template package for creating new API packages that extend the base API functionality.

## Getting Started

To create a new API package for your app:

1. Copy this template to a new package directory:

   ```
   cp -r packages/api-template packages/api-your-app-name
   ```

2. Update the package.json:

   ```json
   {
     "name": "@acme/api-your-app-name"
     // other fields remain the same
   }
   ```

3. Add your app-specific routers in the `src/router/` directory.

4. Update `src/root.ts` to include your app-specific routers.

5. If needed, extend the context in `src/trpc.ts` with app-specific context properties.

## Structure

- `src/index.ts` - Entry point that exports the router and context
- `src/root.ts` - Defines the app router that combines base routers with app-specific routers
- `src/trpc.ts` - Extends the base context with app-specific context
- `src/router/` - Directory for app-specific routers

## Usage in Your App

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api-your-app-name";
import { auth } from "@acme/auth";

// ... rest of your tRPC route handler
```

## Adding Dependencies

If your API needs additional dependencies, add them to your package.json:

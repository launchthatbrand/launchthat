/**
 * Hook exports from payload-cms package
 *
 * This allows importing hooks directly:
 * import { populatePublishedAt, revalidateRedirects, formatSlug } from '@acme/payload-cms/hooks'
 */

// Export individual hooks
export { populatePublishedAt } from "./populatePublishedAt";
export { revalidateRedirects } from "./revalidateRedirects";
export { default as formatSlug } from "./formatSlug";

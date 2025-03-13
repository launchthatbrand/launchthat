// Server-side exports
// These can only be used in Server Components

// Server utilities
export { getServerSideURL } from "./utilities/getURL";
export { mergeOpenGraph } from "./utilities/mergeOpenGraph";
export { Footer } from "./Footer/Component";
export { Header } from "./Header/Component";

// Export server-specific hooks - these must only be used in server components
// Never import these in client components or files with 'use client' directive
export { revalidateFooter } from "./Footer/hooks/revalidateFooter";

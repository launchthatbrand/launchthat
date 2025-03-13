import type { Header } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";

import { HeaderClient } from "./Component.client";

export async function Header() {
  try {
    const headerData: Header = await getCachedGlobal("header", 1)();
    return <HeaderClient data={headerData} />;
  } catch (error) {
    // Provide a default header when the global doesn't exist yet
    console.warn("Header global not found, using default header");
    // Create a fallback header with minimum required fields
    const fallbackHeader = {
      id: 0, // Using number as the ID type
      navItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as unknown as Header;

    return <HeaderClient data={fallbackHeader} />;
  }
}

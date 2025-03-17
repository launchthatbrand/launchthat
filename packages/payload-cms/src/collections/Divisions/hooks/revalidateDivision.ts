"use server";

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

import type { Division } from "../../../payload-types";

export const revalidateDivision: CollectionAfterChangeHook<Division> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      const path = `/division/${doc.slug}`;

      payload.logger.info(`Revalidating division at path: ${path}`);

      revalidatePath(path);
      revalidateTag("divisions-sitemap");
    }

    // If the division was previously published, we need to revalidate the old path
    if (previousDoc._status === "published" && doc._status !== "published") {
      const oldPath = `/divisions/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old division at path: ${oldPath}`);

      revalidatePath(oldPath);
      revalidateTag("divisions-sitemap");
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Division> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/division/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag("division-sitemap");
  }

  return doc;
};

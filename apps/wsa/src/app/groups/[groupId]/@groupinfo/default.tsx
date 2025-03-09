"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Default() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  useEffect(() => {
    router.push(`/groups/${groupId}/dashboard`);
  }, [router, groupId]);

  return null;
}

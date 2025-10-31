import { auth } from "./auth";
import { cache } from "react";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

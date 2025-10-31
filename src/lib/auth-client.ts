import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import {
  adminClient,
  usernameClient,
  emailOTPClient,
  phoneNumberClient
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    usernameClient(),
    emailOTPClient(),
    phoneNumberClient(),
    nextCookies(),
  ],
});

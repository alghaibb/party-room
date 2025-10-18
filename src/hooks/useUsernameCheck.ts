import { useState, useEffect, useCallback } from "react";
import { UseFormWatch, UseFormSetError, UseFormClearErrors } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { SignUpValues } from "@/lib/validations/auth/sign-up.schema";

interface UseUsernameCheckOptions {
  debounceMs?: number;
  minLength?: number;
  watch: UseFormWatch<SignUpValues>;
  setError: UseFormSetError<SignUpValues>;
  clearErrors: UseFormClearErrors<SignUpValues>;
}

export function useUsernameCheck({
  debounceMs = 500,
  minLength = 3,
  watch,
  setError,
  clearErrors,
}: UseUsernameCheckOptions) {
  const [isChecking, setIsChecking] = useState(false);
  const username = watch("username");

  const checkUsername = useCallback(async (usernameToCheck: string) => {
    if (usernameToCheck.length < minLength) {
      clearErrors("username");
      return;
    }

    setIsChecking(true);

    try {
      const { data, error } = await authClient.isUsernameAvailable({
        username: usernameToCheck,
      });

      if (error) {
        setError("username", {
          type: "manual",
          message: error.message || "Invalid username",
        });
      } else if (!data?.available) {
        setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
      } else {
        clearErrors("username");
      }
    } catch (error) {
      console.error("Username check error:", error);
      setError("username", {
        type: "manual",
        message: "Network error occurred",
      });
    } finally {
      setIsChecking(false);
    }
  }, [setError, clearErrors, minLength]);

  useEffect(() => {
    if (!username || username.length < minLength) {
      clearErrors("username");
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsername(username);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [username, debounceMs, checkUsername, clearErrors, minLength]);

  return { isChecking };
}

import { useState } from "react";
import { checkUsernameAvailability } from "@/app/onboarding/actions";
import { debounce } from "@/lib/debounce";

interface UseUsernameAvailabilityOptions {
  debounceMs?: number;
  minLength?: number;
}

interface UseUsernameAvailabilityResult {
  isAvailable: boolean | null;
  isChecking: boolean;
  error: string | null;
  message: string | null;
  checkUsername: (username: string) => void;
}

export function useUsernameAvailability(
  options: UseUsernameAvailabilityOptions = {}
): UseUsernameAvailabilityResult {
  const { debounceMs = 500, minLength = 3 } = options;

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  const resetState = () => {
    setIsAvailable(null);
    setMessage(null);
    setError(null);
    setIsChecking(false);
  };

  const checkUsernameAvailabilityFn = async (username: string): Promise<void> => {
    resetState();

    if (username.length < minLength) {
      return;
    }

    setIsChecking(true);

    try {
      const data = await checkUsernameAvailability(username);
      setIsAvailable(data.available);
      setMessage(data.message);
    } catch (error) {
      console.error("Error checking username availability:", error);
      setError("Failed to check username availability. Please try again.");
      resetState();
    } finally {
      setIsChecking(false);
    }
  };

  // Create debounced version - React Compiler will handle memoization
  const debouncedCheckFunction = debounce((username: string) => {
    checkUsernameAvailabilityFn(username);
  }, debounceMs);

  const checkUsername = (username: string) => {
    if (!username || username.length < minLength) {
      resetState();
      return;
    }

    debouncedCheckFunction(username);
  };


  return {
    isAvailable,
    isChecking,
    error,
    message,
    checkUsername,
  };
}

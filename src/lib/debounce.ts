/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified delay has elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a debounced function that returns a Promise, useful for async operations
 * 
 * @param func - The async function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns The debounced function that returns a Promise
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeoutId: NodeJS.Timeout | null = null;
  let currentPromise: Promise<Awaited<ReturnType<T>>> | null = null;

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    // If there's a current promise, we'll return it
    if (currentPromise) {
      return currentPromise;
    }

    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Create a new promise that will resolve after the delay
    currentPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args) as Awaited<ReturnType<T>>;
          resolve(result);
        } catch (error) {
          console.error("Debounced async function error:", error);
          reject(error);
        } finally {
          timeoutId = null;
          currentPromise = null;
        }
      }, delay);
    });

    return currentPromise;
  };
}

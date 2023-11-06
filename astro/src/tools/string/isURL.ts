/**
 * Converts the target string to a URL and returns true if successful or false if it threw an error.
 * @param target the string to test
 */
export const isURL = (target: string): boolean => {
  try {
    new URL(target);
    return true;
  } catch (e) {
    return false;
  }
}
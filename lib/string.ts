/**
 * Trim whitespace including fullwidth spaces (U+3000) from both ends of a string.
 */
export function trimWithFullwidth(s: string): string {
  return s.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

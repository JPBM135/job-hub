export function decodeBase64Url(input: string) {
  // Replace non-url compatible chars with base64 standard chars
  let replacedInput = input.replaceAll('-', '+').replaceAll('_', '/');

  // Pad out with standard base64 required padding characters
  const pad = replacedInput.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }

    replacedInput += Array.from({ length: 5 - pad }).join('=');
  }

  return atob(replacedInput);
}

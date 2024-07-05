export function debounce<T>(
  fn: (value?: T) => void,
  delay: number,
): (value?: T) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (value?: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(value);
    }, delay);
  };
}

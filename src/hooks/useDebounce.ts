import { useEffect, useState } from "react";

/**
 * Debounce hook: Trả về giá trị chỉ sau khi người dùng ngừng nhập một khoảng thời gian.
 * @param value Giá trị cần debounce
 * @param delay Thời gian trễ (ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to clean up object URLs and prevent memory leaks
 */
export function useObjectURL(file: File | null): string | null {
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (file) {
      // Clean up previous URL
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      
      // Create new URL
      urlRef.current = URL.createObjectURL(file);
    }

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file]);

  return urlRef.current;
}

/**
 * Hook to debounce values and prevent excessive re-renders
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to track component render count in development
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
}

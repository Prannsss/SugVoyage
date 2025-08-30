
'use client';

import { useState, useEffect, useCallback } from 'react';

type PermissionType = 'camera' | 'analytics';

const getInitialPermission = (key: string, defaultValue: boolean): boolean => {
  if (typeof window === 'undefined') {
    // On the server, always return false to avoid hydration mismatch.
    // The actual value will be set on the client in useEffect.
    return false;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

export function usePermission(type: PermissionType, defaultValue = false) {
  const key = `permission_${type}`;
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    // This effect ensures state is synchronized with localStorage on the client,
    // preventing hydration mismatches. It runs only on the client, after the
    // initial server render.
    setHasPermission(getInitialPermission(key, defaultValue));
  }, [key, defaultValue]);


  const setPermission = useCallback(
    (value: boolean) => {
      try {
        setHasPermission(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [key]
  );

  return { hasPermission, setPermission };
}

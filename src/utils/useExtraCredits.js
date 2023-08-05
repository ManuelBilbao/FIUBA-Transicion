import { useCallback, useEffect, useRef, useState } from 'react';

export function useExtraCredits(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const readOnly = (new URLSearchParams(document.location.search).get("code")) !== null;
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const value = new URLSearchParams(document.location.search).get("xcredits");

      if (value !== null) {
        const credits = parseInt(value);
        return credits;
      }

      if (readOnly)
        return initialValue;

      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? parseInt(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const setValueRef = useRef();

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  useEffect(() => {
    setValueRef.current = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        let valueToStore =
          value instanceof Function ? value(storedValue) : value;

        if (isNaN(valueToStore))
          valueToStore = 0;

        // Save state
        setStoredValue(value);

        if (readOnly)
          return;

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, valueToStore);
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    }
  }, [key, readOnly, storedValue]);

  const setValue = useCallback((value) => {
    setValueRef.current(value)
  }, []);

  return [storedValue ??[], setValue];
}

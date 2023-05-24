import { useState } from 'react';

function decode(code) {
  const carrera = ["informatica", "industrial"][parseInt(code[0], 16)];
  const plan86 = require(`../planes/${carrera}/plan_86.json`);
  
  let bits = "";
  for (let i = 1; i < code.length; i++) {
    bits += parseInt(code[i], 16).toString(2).padStart(4, 0);
  }

  let materias = [];
  materias = materias.concat(plan86.obligatorias.filter((materia, idx) => bits[idx] === "1"));
  let offset = plan86.obligatorias.length;
  plan86.orientaciones.forEach(orientacion => {
    materias = materias.concat(orientacion.materias.filter((materia, idx) => bits[idx+offset] === "1"));
    offset += orientacion.materias.length;
  });
  materias = materias.concat(plan86.electivas.filter((materia, idx) => bits[idx+offset] === "1"));
  return materias;
}

export function useMaterias86(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [readOnly, setReadOnly] = useState(false);
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        const shareCode = new URLSearchParams(document.location.search).get("code");
        if (shareCode !== null) {
          const values = decode(shareCode);
          setReadOnly(true);
          return values;
        }
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);

        if (readOnly)
          return;

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
    return [storedValue ??[], setValue, readOnly];
  }
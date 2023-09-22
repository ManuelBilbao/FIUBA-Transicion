import { useCallback, useEffect, useRef, useState } from 'react';
import plan86 from '../plan_86.json';

function decode(code) {
  let bits = "";
  for (let i = 0; i < code.length; i++) {
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

function migrate(oldItem) {
  let materias = plan86.obligatorias.filter(materia => oldItem.some(m => m.nombre === materia.nombre));
  plan86.orientaciones.forEach(orientacion => {
    materias = materias.concat(orientacion.materias.filter(materia => oldItem.some(m => m.nombre === materia.nombre)));
  });
  materias = materias.concat(plan86.electivas.filter(materia => oldItem.some(m => m.nombre === materia.nombre)));
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
      let item = window.localStorage.getItem(key);
      // Parse stored json or try to migrate or if none return initialValue
      if (item) {
        return JSON.parse(item);
      } else {
        item = window.localStorage.getItem("materias86-calculadorBilbao");

        if (item === null)
          return initialValue;

        const migration = migrate(JSON.parse(item));
        window.localStorage.setItem(key, JSON.stringify(migration));
        return migration;
      }
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
        const valueToStore =
        value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(value);

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
    }
  }, [key, readOnly, storedValue]);

  const setValue = useCallback((value) => {
    setValueRef.current(value)
  }, []);

  return [storedValue ??[], setValue, readOnly];
}

import { useCallback, useEffect, useRef, useState } from 'react';

// Ejecuta una función asíncrona y expone { data, loading, error, reload }.
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const alive = useRef(true);

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const data = await fnRef.current();
      if (alive.current) setState({ data, loading: false, error: '' });
    } catch (e) {
      if (alive.current) setState({ data: null, loading: false, error: e?.message || 'Ocurrió un error inesperado.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    alive.current = true;
    run();
    return () => {
      alive.current = false;
    };
  }, [run]);

  return { ...state, reload: run };
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setSession(await api.getSession());
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return api.onAuthChange(refresh);
  }, [refresh]);

  const value = useMemo(
    () => ({
      loading,
      user: session?.user || null,
      profile: session?.profile || null,
      isLoggedIn: Boolean(session?.user),
      isAdmin: session?.profile?.role === 'admin',
      refresh,
      signIn: async (data) => {
        await api.signIn(data);
        await refresh();
      },
      signUp: async (data) => {
        const result = await api.signUp(data);
        await refresh();
        return result;
      },
      signOut: async () => {
        await api.signOut();
        await refresh();
      },
    }),
    [session, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return ctx;
}

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create player profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('players')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: displayName,
        });

      if (profileError) throw profileError;

      // Create initial game stats
      const { error: statsError } = await supabase
        .from('game_stats')
        .insert({
          player_id: data.user.id,
        });

      if (statsError) throw statsError;
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateDisplayName = async (displayName: string) => {
    if (!authState.user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('players')
      .update({ display_name: displayName })
      .eq('id', authState.user.id);

    if (error) throw error;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateDisplayName,
  };
};
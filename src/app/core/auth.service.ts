import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = signal(false);

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      this.isLoggedIn.set(!!data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      this.isLoggedIn.set(!!session);
    });
  }

  login(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  logout() {
    return supabase.auth.signOut();
  }
}

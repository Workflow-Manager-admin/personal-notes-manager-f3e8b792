import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private session$ = new BehaviorSubject<Session | null>(null);
  private user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.session$.next(session);
      this.user$.next(session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session$.next(session);
      this.user$.next(session?.user ?? null);
    });
  }

  // PUBLIC_INTERFACE
  getSession(): Observable<Session | null> {
    /** Returns observable for current session. */
    return this.session$.asObservable();
  }

  // PUBLIC_INTERFACE
  getUser(): Observable<User | null> {
    /** Returns observable for current user. */
    return this.user$.asObservable();
  }

  // PUBLIC_INTERFACE
  async signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
    /** Signs in user with email and password. */
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  // PUBLIC_INTERFACE
  async signUpWithEmail(email: string, password: string): Promise<{ error: string | null }> {
    /** Signs up a new user. */
    const { error } = await this.supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  // PUBLIC_INTERFACE
  async signOut(): Promise<void> {
    /** Signs out the current user. */
    await this.supabase.auth.signOut();
  }

  // PUBLIC_INTERFACE
  async getNotes(search: string = ''): Promise<Note[]> {
    /** Fetches notes for the current user, filtered by search if provided. */
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];
    let query = this.supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    const { data, error } = await query;
    if (error) return [];
    return data as Note[];
  }

  // PUBLIC_INTERFACE
  async getNoteById(id: string): Promise<Note | null> {
    /** Returns a note by ID (if owned by current user). */
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    if (error) return null;
    return data as Note;
  }

  // PUBLIC_INTERFACE
  async createNote(title: string, content: string): Promise<{ note: Note | null, error: string | null }> {
    /** Creates a new note. */
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { note: null, error: 'No user' };
    const { data, error } = await this.supabase
      .from('notes')
      .insert([{ title, content, user_id: user.id }])
      .select()
      .single();
    if (error) return { note: null, error: error.message };
    return { note: data, error: null };
  }

  // PUBLIC_INTERFACE
  async updateNote(id: string, title: string, content: string): Promise<{ note: Note | null, error: string | null }> {
    /** Updates an existing note. */
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { note: null, error: 'No user' };
    const { data, error } = await this.supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) return { note: null, error: error.message };
    return { note: data, error: null };
  }

  // PUBLIC_INTERFACE
  async deleteNote(id: string): Promise<{ error: string | null }> {
    /** Deletes a note by ID. */
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return { error: 'No user' };
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    return { error: error?.message ?? null };
  }
}

declare var window: any;

export const environment = {
  production: false,
  supabaseUrl: typeof window !== 'undefined' && window.env?.SUPABASE_URL ? window.env.SUPABASE_URL : '',
  supabaseKey: typeof window !== 'undefined' && window.env?.SUPABASE_KEY ? window.env.SUPABASE_KEY : ''
};

// This script sets window.env so environment.ts can load Supabase config from environment variables at runtime.
// To use different environments, replace the contents of window.env below.
/* eslint-disable no-undef */
if (typeof window !== 'undefined') {
  window.env = {
    SUPABASE_URL: '', // <-- Fill in for local dev, or overwrite at deploy
    SUPABASE_KEY: ''
  };
}

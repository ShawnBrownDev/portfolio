import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../supabase/supa-schema';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll() {
        if (typeof document === 'undefined') {
          return [];
        }
        return document.cookie.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=');
          return { name, value };
        });
      },
      setAll(cookiesToSet) {
        if (typeof document === 'undefined') {
          return;
        }
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=/; max-age=${options?.maxAge || 31536000}`;
        });
      },
    },
  }
);

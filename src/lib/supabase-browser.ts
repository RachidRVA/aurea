import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr';

// Browser-side client using @supabase/ssr for cookie-based auth
// This ensures the session is stored in cookies (not just localStorage)
// so the middleware can read it for route protection
let browserClient: ReturnType<typeof createSSRBrowserClient> | null = null;

export function createBrowserClient() {
  if (browserClient) return browserClient;
  browserClient = createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return browserClient;
}

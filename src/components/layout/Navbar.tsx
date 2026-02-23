'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { BRAND } from '@/config/brand';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/letter/latest', label: 'Letter' },
  { href: '/directions', label: 'Directions' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/practice', label: 'Practice' },
  { href: '/return', label: 'Return' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const getSupabase = () => createBrowserClient();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="border-b border-gold-200/20 bg-cream-50/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-gray-800 hover:text-gold-700 transition-colors">
          {BRAND.name}
        </Link>

        <nav className="flex items-center gap-6 text-sm font-sans">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 ${
                isActive(link.href)
                  ? 'text-gold-700 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </header>
  );
}

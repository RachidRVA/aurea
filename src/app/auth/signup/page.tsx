'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { createBrowserClient } from '@/lib/supabase-browser';

// Access codes that grant entry — set via env var or use defaults
// Multiple codes can be comma-separated in the env var
const VALID_ACCESS_CODES = (
  process.env.NEXT_PUBLIC_ACCESS_CODES || 'AUREA-BETA-2026,AUREA-FOUNDERS'
).split(',').map(c => c.trim().toUpperCase());

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getSupabase = () => createBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate access code first
    if (!VALID_ACCESS_CODES.includes(accessCode.trim().toUpperCase())) {
      setError('Invalid access code. Please contact the Aurea team for access.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, access_code: accessCode.trim().toUpperCase() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gold-400/50 animate-breathe" />
          </div>
          <h1 className="font-serif text-3xl text-gray-900">Check Your Email</h1>
          <p className="font-serif text-lg text-gray-500 italic">
            We sent a confirmation link to <span className="text-gold-700">{email}</span>.
            Click it to activate your account and begin your diagnostic.
          </p>
          <Link href="/auth/signin" className="text-sm text-gold-700 hover:text-gold-900 font-sans">
            Return to Sign In →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="font-serif text-2xl text-gold-700 inline-block">{BRAND.name}</Link>
          <h1 className="font-serif text-3xl text-gray-900">Begin Your Journey</h1>
          <p className="text-sm text-gray-500 font-sans">Create your account to access the diagnostic</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm border border-gold-200/50 rounded-2xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-sans">
              {error}
            </div>
          )}

          {/* Access Code — first field, prominent */}
          <div className="space-y-2">
            <label className="text-sm font-sans text-gray-600">
              Access Code <span className="text-gold-600">*</span>
            </label>
            <input
              type="text"
              required
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 bg-gold-50/50 border border-gold-300/60 rounded-xl font-sans text-gray-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-400/30 transition-colors uppercase tracking-wider text-center"
              placeholder="Enter your access code"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="text-xs text-gray-400 font-sans text-center">
              Aurea is in private beta. You need an access code to sign up.
            </p>
          </div>

          <div className="border-t border-gold-200/30" />

          <div className="space-y-2">
            <label className="text-sm font-sans text-gray-600">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-200/50 rounded-xl font-sans text-gray-900 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-sans text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-200/50 rounded-xl font-sans text-gray-900 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-sans text-gray-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-200/50 rounded-xl font-sans text-gray-900 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-sans text-gray-600">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream-50 border border-gold-200/50 rounded-xl font-sans text-gray-900 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-sans">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-gold-700 hover:text-gold-900">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

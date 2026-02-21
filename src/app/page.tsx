import Link from 'next/link';
import { BRAND } from '@/config/brand';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream-50">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-300/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-2xl text-center space-y-12">
        {/* Logo mark */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-gold-400/50 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400/40 to-emerald-400/30 animate-breathe" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="font-serif text-6xl md:text-7xl text-gray-900 tracking-tight">
            {BRAND.name}
          </h1>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-gold-700/70">
            {BRAND.tagline}
          </p>
        </div>

        {/* Manifesto line */}
        <p className="font-serif text-xl text-gray-600 leading-relaxed italic max-w-lg mx-auto">
          {BRAND.manifesto}
        </p>

        {/* Description */}
        <p className="font-sans text-base text-gray-500 leading-relaxed max-w-md mx-auto">
          Twelve stations. One geometry. A living map of how your awareness distributes
          across memory, mastery, and meaning.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/diagnostic" className="btn-primary text-center">
            Begin Your Diagnostic
          </Link>
          <Link href="/dashboard" className="btn-serene text-center">
            Return to Your Map
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 font-sans pt-8">
          60–75 minutes of contemplative reflection &middot; Auto-saves as you go
        </p>
      </div>

      {/* Bottom accent */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </main>
  );
}

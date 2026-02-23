'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { BRAND } from '@/config/brand';
import { createBrowserClient } from '@/lib/supabase-browser';

// ─── TYPES ──────────────────────────────────────────
interface Chapter {
  name: string;
  startWord: number;
}

interface PodcastData {
  title: string;
  script_text: string;
  chapter_markers: Chapter[];
  word_count: number;
}

interface TextChunk {
  text: string;
  chapterIndex: number;
  hasPauseAfter: boolean;
}

// ─── DEMO DATA ──────────────────────────────────────
const DEMO_PODCAST: PodcastData = {
  title: 'The Geometry of Light and Flow',
  word_count: 620,
  script_text: `Welcome to your personalized Aurea podcast. This audio letter was written specifically for you, woven from the patterns your responses revealed.

[pause]

Chapter 1 — The Foundation

Light inhabits structure, not the other way around. This is the central truth your coherence map reflects. You have spent years building architectures — some visible, some held in the quiet frameworks of how you think, lead, and relate. Your stations of clarity, consistency, and coherence reveal a mind that naturally organizes complexity into proportion. You see the hinge points where one system connects to another. You understand that every design has a geometry underneath it.

[pause]

But there is something more subtle in your pattern. It is not just your capacity to build. It is your capacity to let light move through what you build. In the descent arc, your foundation is stable. You trust your own ground. In the hinge zone, you flex between effort and grace with remarkable balance. And in the ascent, you naturally extend your coherence outward — not to dominate space, but to illuminate it.

[pause]

Chapter 2 — The Present Coherence

This is the signature of someone for whom leadership has never been about control. It has always been about transmission. The invitation in your geometry is to trust this even more. You have proven, to yourself and others, that you can structure clarity.

[pause]

The next evolution is understanding that your truest work is not to build more buildings. It is to create conditions where others can build from understanding rather than confusion. To be a transmitter of the geometry itself.

[pause]

Chapter 3 — The Direction Forward

Three directions emerge from this coherence. First: structural leadership. You are exceptionally suited to roles where the architecture itself is the deliverable. Where the way something is organized determines whether it can breathe.

Second: contemplative innovation. You pair deep reflection with practical execution. This creates a rare form of problem-solving rooted in understanding rather than haste.

Third: teaching and transmission. You have a gift for translating complexity into clarity. Your natural vocabulary is geometric. You speak in patterns and proportions.

[pause]

Chapter 4 — The Closing

Your practice in this cycle is twofold. First, notice where you naturally bring geometry to chaos. Notice where your presence itself seems to help others think more clearly. These are not accidents. These are hints of your path.

[pause]

Second, choose. In the next 30 days, choose one of your directions. Not the most practical. Not the most lucrative. The one that feels most like home. The one where your work becomes indistinguishable from your prayer.

The world will not organize itself. It needs translators. People who understand that proportion and flow are not luxuries — they are necessities. You are one of those people. Trust it.

[pause]

This is your Aurea. This is your map. Walk it with confidence. The next return is in six months. Until then, tend your axis. Remember your proportions. And trust the light.`,
  chapter_markers: [
    { name: 'The Foundation', startWord: 0 },
    { name: 'The Present Coherence', startWord: 200 },
    { name: 'The Direction Forward', startWord: 340 },
    { name: 'The Closing', startWord: 460 },
  ],
};

// ─── HELPERS ────────────────────────────────────────
function timeToString(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function splitIntoChunks(text: string): TextChunk[] {
  // Split by chapter headings
  const chapterSplits = text.split(/Chapter \d+ —/);
  const chunks: TextChunk[] = [];

  chapterSplits.forEach((section, idx) => {
    if (!section.trim()) return;
    // Split by [pause] markers
    const parts = section.split(/\[pause\]/);
    parts.forEach((part, pIdx) => {
      const cleaned = part.trim().replace(/\s+/g, ' ');
      if (cleaned.length > 0) {
        chunks.push({
          text: cleaned,
          chapterIndex: Math.max(0, idx - 1),
          hasPauseAfter: pIdx < parts.length - 1,
        });
      }
    });
  });

  return chunks;
}

// ─── PREFERRED VOICES ───────────────────────────────
const PREFERRED_VOICES = [
  'Samantha', 'Daniel', 'Karen', 'Moira', 'Fiona', 'Tessa',
  'Google UK English Female', 'Google UK English Male',
  'Microsoft Zira', 'Microsoft David',
];

// ─── COMPONENT ──────────────────────────────────────
export default function PodcastPage() {
  const [podcast, setPodcast] = useState<PodcastData>(DEMO_PODCAST);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [totalEstSec, setTotalEstSec] = useState(0);

  const startTimeRef = useRef(0);
  const elapsedBeforePauseRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<TextChunk[]>([]);
  const currentChunkRef = useRef(0);
  const isPlayingRef = useRef(false);
  const speedRef = useRef(1);

  // ─── LOAD REAL DATA FROM SUPABASE ─────────────────
  useEffect(() => {
    async function fetchPodcast() {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('podcast_scripts')
          .select('title, script_text, chapter_markers, word_count')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setPodcast(data as PodcastData);
        }
      } catch {
        // Fall back to demo data silently
      }
    }
    fetchPodcast();
  }, []);

  // ─── CALCULATE DURATION ───────────────────────────
  useEffect(() => {
    const words = podcast.script_text.split(/\s+/).length;
    const wordsPerMin = 145; // natural speaking pace
    setTotalEstSec(Math.ceil((words / wordsPerMin) * 60));
  }, [podcast]);

  // ─── LOAD VOICES ──────────────────────────────────
  useEffect(() => {
    function loadVoices() {
      const available = speechSynthesis.getVoices();
      if (available.length === 0) return;

      const sorted = [...available].sort((a, b) => {
        const aP = PREFERRED_VOICES.findIndex(p => a.name.includes(p));
        const bP = PREFERRED_VOICES.findIndex(p => b.name.includes(p));
        if (aP !== -1 && bP === -1) return -1;
        if (aP === -1 && bP !== -1) return 1;
        if (aP !== -1 && bP !== -1) return aP - bP;
        const aEn = a.lang.startsWith('en');
        const bEn = b.lang.startsWith('en');
        if (aEn && !bEn) return -1;
        if (!aEn && bEn) return 1;
        return a.name.localeCompare(b.name);
      });

      setVoices(sorted);
      if (!selectedVoice && sorted.length > 0) {
        setSelectedVoice(sorted[0].name);
      }
    }

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, [selectedVoice]);

  // ─── CHROME TTS KEEPALIVE ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        speechSynthesis.resume();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── CLEANUP ON UNMOUNT ───────────────────────────
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── TIMER ────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const raw = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000;
      setElapsed(raw * speedRef.current);
    }, 500);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // ─── SPEAK CHUNKS RECURSIVELY ─────────────────────
  const speakChunks = useCallback((chunks: TextChunk[], index: number) => {
    if (index >= chunks.length || !isPlayingRef.current) {
      // Finished
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
      stopTimer();
      setElapsed(totalEstSec);
      return;
    }

    const chunk = chunks[index];
    currentChunkRef.current = index;
    setCurrentChapterIndex(chunk.chapterIndex);

    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.rate = speedRef.current;
    utterance.pitch = 1.0;

    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      const delay = chunk.hasPauseAfter ? 1200 : 300;
      setTimeout(() => {
        if (isPlayingRef.current) {
          speakChunks(chunks, index + 1);
        }
      }, delay);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && isPlayingRef.current) {
        setTimeout(() => speakChunks(chunks, index + 1), 500);
      }
    };

    speechSynthesis.speak(utterance);
  }, [voices, selectedVoice, totalEstSec, stopTimer]);

  // ─── START PLAYBACK ───────────────────────────────
  const startPlayback = useCallback((fromChapter: number = 0) => {
    speechSynthesis.cancel();
    stopTimer();

    const chunks = splitIntoChunks(podcast.script_text);
    chunksRef.current = chunks;

    const startChunks = fromChapter > 0
      ? chunks.filter(c => c.chapterIndex >= fromChapter)
      : chunks;

    if (startChunks.length === 0) return;

    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);

    // Estimate elapsed time offset
    const skipped = chunks.length - startChunks.length;
    const portion = skipped / chunks.length;
    elapsedBeforePauseRef.current = portion * totalEstSec;
    startTimeRef.current = Date.now();

    speakChunks(startChunks, 0);
    startTimer();
  }, [podcast, totalEstSec, speakChunks, startTimer, stopTimer]);

  // ─── STOP PLAYBACK ───────────────────────────────
  const stopPlayback = useCallback(() => {
    speechSynthesis.cancel();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    stopTimer();
  }, [stopTimer]);

  // ─── TOGGLE PLAY/PAUSE ───────────────────────────
  const togglePlayPause = () => {
    if (isPlaying && !isPaused) {
      // Pause
      speechSynthesis.pause();
      setIsPaused(true);
      elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      stopTimer();
    } else if (isPaused) {
      // Resume
      speechSynthesis.resume();
      setIsPaused(false);
      startTimeRef.current = Date.now();
      startTimer();
    } else {
      // Start fresh
      startPlayback(0);
    }
  };

  // ─── CHAPTER CLICK ────────────────────────────────
  const handleChapterClick = (chapterIndex: number) => {
    stopPlayback();
    setTimeout(() => startPlayback(chapterIndex), 100);
  };

  // ─── SKIP ─────────────────────────────────────────
  const skipForward = () => {
    const next = Math.min(currentChapterIndex + 1, (podcast.chapter_markers?.length || 1) - 1);
    stopPlayback();
    setTimeout(() => startPlayback(next), 100);
  };

  const skipBack = () => {
    const prev = Math.max(currentChapterIndex - 1, 0);
    stopPlayback();
    setTimeout(() => startPlayback(prev), 100);
  };

  // ─── SPEED CHANGE ─────────────────────────────────
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    if (isPlaying) {
      if (!isPaused) {
        elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      }
      speechSynthesis.cancel();
      isPlayingRef.current = false;
      const chapter = currentChapterIndex;
      setTimeout(() => startPlayback(chapter), 100);
    }
  };

  // ─── VOICE CHANGE ─────────────────────────────────
  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    if (isPlaying) {
      if (!isPaused) {
        elapsedBeforePauseRef.current += (Date.now() - startTimeRef.current) / 1000;
      }
      speechSynthesis.cancel();
      isPlayingRef.current = false;
      const chapter = currentChapterIndex;
      setTimeout(() => startPlayback(chapter), 100);
    }
  };

  // ─── PROGRESS ─────────────────────────────────────
  const progressPct = totalEstSec > 0 ? Math.min(100, (elapsed / totalEstSec) * 100) : 0;
  const currentChapter = podcast.chapter_markers?.[currentChapterIndex];

  // ─── RENDER ───────────────────────────────────────
  return (
    <main className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="border-b border-gold-200/20 bg-cream-50/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-gray-800">{BRAND.name}</Link>
          <nav className="flex items-center gap-6 text-sm font-sans">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">Dashboard</Link>
            <Link href="/letter/demo" className="text-gray-500 hover:text-gray-700 transition-colors">Letter</Link>
            <Link href="/directions" className="text-gray-500 hover:text-gray-700 transition-colors">Directions</Link>
            <Link href="/podcast" className="text-gold-700">Podcast</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">
        {/* Title */}
        <section className="text-center space-y-4">
          <h1 className="font-serif text-5xl text-gray-900">{podcast.title}</h1>
          <p className="font-serif text-lg text-gray-500 italic">Your personalized audio letter</p>
        </section>

        {/* Player */}
        <section className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-gold-200/50 rounded-3xl p-10 space-y-6">
            {/* Main controls */}
            <div className="flex items-center justify-center gap-6">
              <button onClick={skipBack} className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center hover:bg-gold-200 transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlayPause}
                className={`w-20 h-20 rounded-full flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                  isPlaying && !isPaused
                    ? 'bg-gradient-to-br from-red-400 to-red-600 text-white'
                    : 'bg-gradient-to-br from-gold-400 to-gold-600 text-white'
                }`}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-8 h-8 fill-white" />
                ) : (
                  <Play className="w-8 h-8 fill-white ml-1" />
                )}
              </button>

              <button onClick={skipForward} className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center hover:bg-gold-200 transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Animated wave */}
            {isPlaying && !isPaused && (
              <div className="flex items-end justify-center gap-[3px] h-5">
                {[6, 12, 18, 10, 20, 14, 8].map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-sm bg-gold-400"
                    style={{
                      animation: `wave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                      height: `${h}px`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Status */}
            <div className="text-center space-y-1">
              <p className="text-xs font-sans text-gray-400 uppercase tracking-widest">
                {!isPlaying ? 'Ready to play' : isPaused ? 'Paused' : 'Playing'}
              </p>
              <p className="font-serif text-sm text-gold-700 italic">
                {currentChapter ? currentChapter.name : podcast.title}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div
                className="w-full h-2 bg-gold-100 rounded-full cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  const chapters = podcast.chapter_markers || [];
                  const chapter = Math.min(chapters.length - 1, Math.floor(pct * chapters.length));
                  handleChapterClick(Math.max(0, chapter));
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-sans">
                <span>{timeToString(elapsed)}</span>
                <span>~{timeToString(totalEstSec)}</span>
              </div>
            </div>

            {/* Speed + Voice controls */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-sans">Speed</span>
                {[0.8, 1, 1.2, 1.5].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
                      speed === s
                        ? 'bg-gold-500 text-white'
                        : 'bg-gold-50 text-gray-500 hover:bg-gold-100'
                    }`}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              {voices.length > 0 && (
                <select
                  value={selectedVoice}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="text-xs font-sans bg-gold-50 border border-gold-200/50 rounded-lg px-3 py-1.5 text-gray-600 max-w-[200px]"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-sans">Browser text-to-speech · Best with headphones</span>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-gray-900">Chapters</h2>
          <div className="space-y-2">
            {(podcast.chapter_markers || []).map((chapter, i) => {
              const isCurrent = currentChapterIndex === i && isPlaying;
              return (
                <button
                  key={i}
                  onClick={() => handleChapterClick(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gold-100 border border-gold-300/50 text-gold-700'
                      : 'bg-white border border-gold-200/30 text-gray-700 hover:border-gold-300/50 hover:bg-gold-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-base">
                      {isCurrent && '▶ '}{chapter.name}
                    </span>
                    <span className="text-xs font-sans text-gray-400">
                      Ch {i + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Full Script */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-gray-900">Full Script</h2>
          <div className="space-y-4 max-w-none">
            {podcast.script_text
              .replace(/\[pause\]/g, '')
              .split('\n\n')
              .filter(p => p.trim())
              .map((paragraph, i) => (
                <p key={i} className="font-serif text-base text-gray-700 leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="bg-white/60 border border-gold-200/30 rounded-2xl p-8 space-y-4 text-center">
          <h3 className="font-serif text-2xl text-gray-900">What&apos;s Next?</h3>
          <p className="font-serif text-base text-gray-700 leading-relaxed">
            Listen to this letter in a quiet space. Let it settle. Then explore your directions and choose one path forward in the next 30 days.
          </p>
          <Link href="/directions" className="btn-primary inline-block mt-4">
            View Your Directions →
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gold-200/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <p className="text-xs text-gray-400 font-sans">{BRAND.footer}</p>
          <p className="text-xs text-gray-300 font-serif italic mt-1">
            This letter was created specifically for you.
          </p>
        </div>
      </footer>

      {/* Wave animation keyframes */}
      <style jsx>{`
        @keyframes wave {
          0% { height: 4px; }
          100% { height: 20px; }
        }
      `}</style>
    </main>
  );
}

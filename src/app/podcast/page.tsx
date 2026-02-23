'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2 } from 'lucide-react';
import { BRAND } from '@/config/brand';

const DEMO_PODCAST = {
  title: 'The Geometry of Light and Flow',
  duration: 1847, // seconds
  script: `Welcome to your personalized Aurea podcast. This audio letter was written specifically for you, woven from the patterns your responses revealed.

The Geometry of Light and Flow

Light inhabits structure, not the other way around. This is the central truth your coherence map reflects.

You have spent years building architectures — some visible, some held in the quiet frameworks of how you think, lead, and relate. Your stations of clarity, consistency, and coherence reveal a mind that naturally organizes complexity into proportion. You see the hinge points where one system connects to another. You understand that every design has a geometry underneath it.

But there is something more subtle in your pattern. It is not just your capacity to build. It is your capacity to let light move through what you build. In the descent arc, your foundation is stable. You trust your own ground. In the hinge zone, you flex between effort and grace with remarkable balance. And in the ascent, you naturally extend your coherence outward — not to dominate space, but to illuminate it.

This is the signature of someone for whom leadership has never been about control. It has always been about transmission.

The invitation in your geometry is to trust this even more. You have proven, to yourself and others, that you can structure clarity. The next evolution is understanding that your truest work is not to build more buildings. It is to create conditions where others can build from understanding rather than confusion. To be a transmitter of the geometry itself.

Where does this show up? Everywhere. In how your mind moves across a problem, you are already teaching. In how you lead conversations, you are already revealing pattern. Your next practice is to lean into this consciously. To understand that your primary offering is not your output — it is your way of seeing.

Three directions emerge from this coherence. First: structural leadership. You are exceptionally suited to roles where the architecture itself is the deliverable. Where the way something is organized determines whether it can breathe. Second: contemplative innovation. You pair deep reflection with practical execution. This creates a rare form of problem-solving rooted in understanding rather than haste. Third: teaching and transmission. You have a gift for translating complexity into clarity. Your natural vocabulary is geometric. You speak in patterns and proportions. And people feel the difference.

But underneath all three is something simpler. It is this: the world needs more people who understand that coherence is not weakness. That taking time to make something whole is not delay — it is the only path to something that will actually last.

Your practice in this cycle is twofold. First, notice. Notice where you naturally bring geometry to chaos. Notice where your presence itself seems to help others think more clearly. Notice the moments when light moves easiest through your structures. These are not accidents. These are hints of your path.

Second, choose. In the next 30 days, choose one of your directions. Not the most practical. Not the most lucrative. The one that feels most like home. The one where your work becomes indistinguishable from your prayer. Explore it. Take one small action. Plant a seed in that soil. You already know how to build. Now practice believing that your geometry matters enough to be shared.

The world will not organize itself. It will not clarify itself. It needs translators. People who understand that proportion and flow are not luxuries — they are necessities. You are one of those people. Trust it.

This is your Aurea. This is your map. Walk it with the confidence of someone who has already proven, to themselves, that they can create coherence. Now extend that gift outward.

Thank you for this time. For these hours of reflection. For the honesty of your responses. For allowing us to map your geometry. The next return is in six months. By then, you will have proven your direction. You will have learned something new about yourself. You will be ready to go deeper.

Until then, tend your axis. Remember your proportions. And trust the light.`,
  chapters: [
    { name: 'Introduction: Light Inhabits Structure', startWord: 0 },
    { name: 'Your Geometry & Pattern', startWord: 45 },
    { name: 'Transmission as Leadership', startWord: 210 },
    { name: 'Three Paths Forward', startWord: 340 },
    { name: 'Your Practice & Closing', startWord: 490 },
  ],
};

interface Chapter {
  name: string;
  startWord: number;
  startTime?: number;
}

function timeToString(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PodcastPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>(DEMO_PODCAST.chapters);

  useEffect(() => {
    // Calculate approximate chapter start times based on word count
    // Assuming ~140 words per minute reading speed
    const chaptersWithTime = DEMO_PODCAST.chapters.map(ch => ({
      ...ch,
      startTime: (ch.startWord / 140) * 60,
    }));
    setChapters(chaptersWithTime);
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleChapterClick = (startTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const currentChapter = chapters.find((ch, i) => {
    const nextChapter = chapters[i + 1];
    return ch.startTime !== undefined && (nextChapter ? currentTime < (nextChapter.startTime || Infinity) && currentTime >= ch.startTime : currentTime >= ch.startTime);
  });

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
        {/* Title section */}
        <section className="text-center space-y-4">
          <h1 className="font-serif text-5xl text-gray-900">{DEMO_PODCAST.title}</h1>
          <p className="font-serif text-lg text-gray-500 italic">Your personalized audio letter</p>
        </section>

        {/* Player section */}
        <section className="space-y-8">
          {/* Main player */}
          <div className="bg-white/80 backdrop-blur-sm border border-gold-200/50 rounded-3xl p-12 space-y-8">
            {/* Play button */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayPause}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-white flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 fill-white" />
                ) : (
                  <Play className="w-10 h-10 fill-white ml-1" />
                )}
              </button>
            </div>

            {/* Time display */}
            <div className="text-center space-y-2">
              <p className="font-sans text-sm text-gray-500">
                {timeToString(currentTime)} / {timeToString(DEMO_PODCAST.duration)}
              </p>
              <p className="font-serif text-sm text-gold-700 italic">
                {currentChapter ? `Listening to: ${currentChapter.name}` : 'Begin listening'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={DEMO_PODCAST.duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-gold-100 rounded-full appearance-none cursor-pointer accent-gold-500"
              />
              <div className="flex justify-between text-xs text-gray-400 font-sans">
                <span>{timeToString(currentTime)}</span>
                <span>{timeToString(DEMO_PODCAST.duration)}</span>
              </div>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            >
              <source src="/audio/podcast-demo.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            {/* Volume info */}
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-sans">Optimal listening volume</span>
            </div>
          </div>

          {/* Script fallback */}
          <div className="text-center text-sm text-gray-500 font-sans italic">
            (Audio playback requires an mp3 file. Script is shown below as fallback.)
          </div>
        </section>

        {/* Chapters section */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl text-gray-900">Chapters</h2>
          <div className="space-y-2">
            {chapters.map((chapter, i) => {
              const isCurrentChapter = currentChapter?.name === chapter.name;
              return (
                <button
                  key={i}
                  onClick={() => chapter.startTime !== undefined && handleChapterClick(chapter.startTime)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    isCurrentChapter
                      ? 'bg-gold-100 border border-gold-300/50 text-gold-700'
                      : 'bg-white border border-gold-200/30 text-gray-700 hover:border-gold-300/50 hover:bg-gold-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-serif text-base">{chapter.name}</span>
                    <span className="text-xs font-sans text-gray-400">
                      {chapter.startTime !== undefined && timeToString(chapter.startTime)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Script section */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-gray-900">Full Script</h2>
          <div className="space-y-4 max-w-none">
            {DEMO_PODCAST.script.split('\n\n').map((paragraph, i) => (
              <p key={i} className="font-serif text-base text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="bg-white/60 border border-gold-200/30 rounded-2xl p-8 space-y-4 text-center">
          <h3 className="font-serif text-2xl text-gray-900">What's Next?</h3>
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
    </main>
  );
}

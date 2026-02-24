/**
 * AUREA — Station Micro-Feedback
 *
 * Poetic one-liners shown after each station is completed.
 * Keyed by station number → primary choice → feedback line.
 * These are "poetic mirrors" — not analysis, just resonance.
 */

type MicroFeedbackMap = Record<number, Record<string, string>>;

export const MICRO_FEEDBACK: MicroFeedbackMap = {
  // ─── Station 0: Core Skills (Re-Alignment) ────────────────
  0: {
    'Design': 'You think in shapes before you think in words.',
    'Listening': 'The world speaks to those who slow down enough to hear.',
    'Synthesis': 'You weave what others leave scattered.',
    'Negotiation': 'You find the bridge where others see the wall.',
    'Writing': 'Your pen draws architecture the eye cannot see.',
    'Facilitation': 'You hold the room so others can hold their truth.',
    'Analysis': 'You see the skeleton beneath the skin of things.',
    'Storytelling': 'The world re-members itself through your voice.',
    'Mediation': 'Where there is friction, you bring rhythm.',
    'Curation': 'You select what matters from the noise of everything.',
    'Strategy': 'You play the long game the world hasn\'t started yet.',
    'Mentoring': 'You kindle fires you may never sit beside.',
  },

  // ─── Station +1: Applied Shell (Emergence) ────────────────
  1: {
    'Platform': 'Your architecture wants to reach — to lift others while it stands.',
    'Company': 'You build vessels sturdy enough to carry vision.',
    'Studio': 'The room where your frequency becomes form.',
    'Practice': 'Your rhythm is your structure. No walls required.',
    'Movement': 'What you carry is meant to be carried by many.',
    'Foundation': 'You lay stones that others will build cathedrals on.',
    'Collective': 'Your signal strengthens when it multiplies.',
    'Laboratory': 'You test what the world is not yet ready to trust.',
    'Academy': 'You build lineages, not just lessons.',
    'Network': 'Your architecture is woven from living connections.',
    'Publication': 'You turn inner knowing into public inheritance.',
    'Commons': 'What you build belongs to everyone who arrives.',
  },

  // ─── Station +2: Field Effect (Expansion) ────────────────
  2: {
    'People': 'Souls orbit your purpose — that is your gravity.',
    'Networks': 'The web you weave is wider than you know.',
    'Resources': 'Abundance gathers where coherence leads.',
    'Systems': 'You magnetize the structures that shape worlds.',
    'Culture': 'The atmosphere you carry reshapes every room.',
    'Capital': 'Resources find their way to architectures that hold meaning.',
    'Knowledge': 'What gathers around you is understanding itself.',
    'Technology': 'Tools arrive to serve the vision you emit.',
    'Community': 'You don\'t just attract people — you attract belonging.',
    'Policy': 'The rules of the game want to be rewritten through you.',
    'Land': 'Your roots go deeper than your branches go wide.',
    'Energy': 'There is a current around you that others feel before they name.',
  },

  // ─── Station +3: Civilizational Lever (Translation) ──────
  3: {
    'Education': 'You see the classroom the world hasn\'t built yet.',
    'Finance': 'You understand that capital is just frozen intention.',
    'Governance': 'You hear the code beneath the law.',
    'Health': 'You know that healing is an architecture, not a prescription.',
    'Technology': 'Your lever is the language machines are learning to speak.',
    'Agriculture': 'You tend what feeds the body of civilization itself.',
    'Arts': 'Beauty is your instrument of civilizational change.',
    'Infrastructure': 'You build the bones on which societies stand.',
    'Trade': 'Exchange is the rhythm of the world, and you shape its tempo.',
    'Justice': 'You pull the lever that bends the arc toward fairness.',
    'Environment': 'You hear what the earth is whispering to power.',
    'Media': 'You shape the mirror the world holds up to itself.',
  },

  // ─── Station +4: Transcendent Echo (Transmission) ────────
  4: {
    'Community': 'What you build will hum long after the builders rest.',
    'Legacy': 'You are composing a song that outlives its singer.',
    'Lineage': 'The thread you carry connects past hands to future ones.',
    'Culture': 'The echo you leave reshapes the air for those who follow.',
    'Tradition': 'You renew what was given — not by repeating, but by deepening.',
    'Institution': 'The structure you raise will shelter generations.',
    'Movement': 'Your wave has not yet crested.',
    'Archive': 'You preserve what time would otherwise erase.',
    'Ritual': 'The pattern you return to is the one that returns to you.',
    'Commons': 'What you give to the commons cannot be taken back — only multiplied.',
    'Song': 'The melody you carry was always meant to be heard.',
    'Story': 'Somewhere, a child will tell your story as their origin.',
  },

  // ─── Station +5: Final Return (Stewardship) ──────────────
  5: {
    'Love': 'At the end, it was always love — just dressed in different clothes.',
    'Impact': 'The mark you leave is measured in changed rhythms, not monuments.',
    'Peace': 'Stillness was the destination all along.',
    'Truth': 'You chose the harder path — the one that doesn\'t lie.',
    'Service': 'To serve was never small. It was the whole geometry.',
    'Joy': 'Joy was the compass point you were always walking toward.',
    'Wisdom': 'What you gathered was never for you alone.',
    'Unity': 'The return is the moment all the threads find their braid.',
    'Grace': 'Grace is what remains when effort has done its work.',
    'Clarity': 'You chose to see — even when seeing was not easy.',
    'Presence': 'The deepest return is to the moment you are in.',
    'Silence': 'The truest word is the one that needs no sound.',
  },

  // ─── Station +6: Eschatological Return (Continuation) ────
  6: {
    'Wholeness': 'The circle closes — not in perfection, but in completion.',
    'Compassion': 'Compassion was the final geometry — wide enough for everything.',
    'Transcendence': 'You are the point where the pattern looks beyond itself.',
    'Harmony': 'Every station was a note. This is the chord.',
    'Surrender': 'The deepest power was always the ability to let go.',
    'Light': 'What you carry illuminates without burning.',
    'Return': 'To return is not to go back — it is to arrive for the first time.',
    'Devotion': 'Devotion was the thread that held every station together.',
    'Integration': 'Every fragment finds its place in the whole.',
    'Renewal': 'The cycle does not end — it begins again, richer.',
    'Proportion': 'The golden ratio of your soul is now visible.',
    'Breath': 'In the end, it was always breath — the simplest, deepest signal.',
  },

  // ─── Station -1: Drivers (Hinge / Threshold) ─────────────
  '-1': {
    'Connecting': 'You are alive when the space between souls closes.',
    'Organizing': 'Chaos bows to your geometry.',
    'Creating': 'Something in you insists on making what doesn\'t yet exist.',
    'Protecting': 'The shield you carry is shaped like devotion.',
    'Teaching': 'What drives you is the light in another\'s eyes.',
    'Healing': 'You mend what others walk past.',
    'Building': 'Your hands know the shape of what is coming.',
    'Translating': 'You are the bridge between languages the world hasn\'t matched.',
    'Reforming': 'What drives you is the gap between what is and what could be.',
    'Nurturing': 'You grow what others plant.',
    'Curating': 'You select from the infinite — that is your superpower.',
    'Pioneering': 'You walk the path that has no footprints yet.',
  },

  // ─── Station -2: Origin Imprints (Yielding) ──────────────
  '-2': {
    'Injustice': 'The wound of unfairness became your compass needle.',
    'Belonging': 'You\'ve been searching for the room that feels like home.',
    'Displacement': 'Uprooting taught you how to grow anywhere.',
    'Awakening': 'One moment broke the world open — and you never unsee.',
    'Silence': 'In the silence you were given, you learned to hear everything.',
    'Loss': 'What was taken became the shape of what you now build.',
    'Discovery': 'The moment you found it, you knew you\'d always known.',
    'Rupture': 'The break was the beginning of the architecture.',
    'Grace': 'You were met with kindness when you expected nothing.',
    'Solitude': 'Alone, you found the frequency that crowds drown out.',
    'Migration': 'Movement became your mother tongue.',
    'Revelation': 'The veil lifted — and you chose not to look away.',
  },

  // ─── Station -3: Archetype (Refinement) ───────────────────
  '-3': {
    'Sentinel': 'You stand guard at thresholds others don\'t even see.',
    'Rebel': 'The rules were never your language — you write your own.',
    'Sage': 'Wisdom chose you before you chose it.',
    'Alchemist': 'You transform what others discard into gold.',
    'Weaver': 'You see the threads connecting what appears separate.',
    'Mystic': 'You live between worlds — and that is your power.',
    'Pioneer': 'You carry the map that hasn\'t been drawn yet.',
    'Shepherd': 'You lead without pulling — they follow your rhythm.',
    'Strategist': 'You see the game seven moves ahead.',
    'Torchbearer': 'The flame you carry lights rooms you\'ll never enter.',
    'Oracle': 'You speak what is coming before it arrives.',
    'Craftsman': 'Your hands hold a knowing that precedes thought.',
  },

  // ─── Station -4: Cosmic Role (Commitment) ────────────────
  '-4': {
    'Warrior': 'You were built for the fight that matters most.',
    'Healer': 'Your presence is the first medicine.',
    'Builder': 'You see structure where others see empty space.',
    'Guardian': 'You protect what cannot yet protect itself.',
    'Teacher': 'The universe assigned you to the classroom of becoming.',
    'Artist': 'Creation is not what you do — it is what you are.',
    'Diplomat': 'You are the bridge between opposing truths.',
    'Visionary': 'You see the world that hasn\'t been built yet — and believe in it.',
    'Keeper': 'You hold what must not be forgotten.',
    'Reformer': 'You are the correction the system didn\'t know it needed.',
    'Witness': 'Your seeing makes the invisible real.',
    'Conductor': 'You orchestrate the music others didn\'t know they were playing.',
  },

  // ─── Station -5: Core Qualities (Tension) ────────────────
  '-5': {
    'Discipline': 'Discipline is not your cage — it is your compass.',
    'Joy': 'Joy is the frequency you return to when the noise fades.',
    'Patience': 'You know that the seed and the forest share the same clock.',
    'Resilience': 'What bends you only proves how far you can stretch.',
    'Curiosity': 'The question is your home — the answer, just a waystation.',
    'Devotion': 'You give yourself fully — that is your dangerous gift.',
    'Clarity': 'When the fog comes, you are the one who still sees.',
    'Warmth': 'Your warmth is not softness — it is strength in a different key.',
    'Precision': 'You cut to the truth with the cleanest blade.',
    'Generosity': 'You give before you are asked — and rarely count the cost.',
    'Boldness': 'You step forward when the room holds its breath.',
    'Stillness': 'In your stillness, others find their ground.',
  },

  // ─── Station -6: Covenant (Origin / Root Memory) ─────────
  '-6': {
    'Justice': 'Your soul signed a contract with fairness before you were born.',
    'Freedom': 'The vow you carry is the oldest kind — to live unconfined.',
    'Truth': 'Truth was the first promise — and the one you cannot break.',
    'Mercy': 'You chose mercy when judgment would have been easier.',
    'Beauty': 'Beauty is not what you see — it is the covenant you keep.',
    'Service': 'Before you had a name, you had a vow to serve.',
    'Knowledge': 'Knowing was never optional for you — it is the covenant.',
    'Unity': 'The vow you carry is the one that binds all things together.',
    'Courage': 'Your covenant was signed in the place where fear has no language.',
    'Love': 'Love was the first word — and the one that holds everything.',
    'Harmony': 'Your soul promised to be the tuning fork in a dissonant world.',
    'Integrity': 'Wholeness is not a goal — it is the contract you were born into.',
  },
};

/**
 * Get the micro-feedback for a given station and primary choice.
 * Falls back to a generic message if the specific combo isn't found.
 */
export function getMicroFeedback(station: number, primary: string): string {
  const stationFeedback = MICRO_FEEDBACK[station];
  if (stationFeedback && stationFeedback[primary]) {
    return stationFeedback[primary];
  }
  // Generic fallbacks per station
  const GENERIC: Record<number, string> = {
    0: 'Your core skill hums beneath everything you do.',
    1: 'The shell you chose reveals the shape of your becoming.',
    2: 'What gathers around you is the field you emit.',
    3: 'Your civilizational lever is already in motion.',
    4: 'The echo you leave is longer than you know.',
    5: 'The return you seek was always within reach.',
    6: 'The final geometry speaks in a language beyond words.',
    '-1': 'What drives you is the engine of your architecture.',
    '-2': 'Your origin imprint is the lens through which everything refracts.',
    '-3': 'Your archetype walks with you, even in silence.',
    '-4': 'Your cosmic role is not a burden — it is your belonging.',
    '-5': 'The quality you carry is the one the world needs from you.',
    '-6': 'The covenant you keep is older than memory.',
  };
  return GENERIC[station] || 'Something in you just spoke. Listen.';
}

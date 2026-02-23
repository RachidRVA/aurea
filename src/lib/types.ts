// ─── STATION SYSTEM ──────────────────────────────────────────

export type StationNumber = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StationConfig {
  station: StationNumber;
  name: string;
  arcName: string; // e.g., "Origin (Root Memory)"
  arc: 'descent' | 'hinge' | 'ascent';
  primaryLabel: string;
  secondaryLabel: string;
  options: string[];
  reflectionPrompt: string;
  hingeWeight: number; // 1.0 default, 1.2 for hinge zone
}

export interface StationResponse {
  station: StationNumber;
  primary: string;
  secondary: string;
  reflection: string;
}

// ─── DIAGNOSTIC SESSION ──────────────────────────────────────

export interface DiagnosticSession {
  responses: Record<number, StationResponse>;
  integrationMeta: {
    feeling: string;
    osName: string;
    lexiconChoice: string;
  };
  lifeArc: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  completionPercent: number;
  currentStation: number; // Index in the ordered station array
}

// ─── SCORING ─────────────────────────────────────────────────

export interface CoherenceScore {
  station: StationNumber;
  clarity: number;
  consistency: number;
  coherence: number;
  weighted: number;
}

export interface CompassAnalytics {
  gravityIndex: number;
  graceIndex: number;
  balanceRatio: number;
  hcr: number;
  quadrant: 'equilibrium' | 'compression' | 'expansion' | 'latency';
  vectorDirection: string;
}

export interface BlindSpotFlag {
  flagType: 'OVER_ACTIVE' | 'UNDER_ACTIVE';
  stationA: StationNumber;
  stationB: StationNumber;
  delta: number;
  narrative: string;
  movement: string;
}

export interface SynergyPair {
  stationA: StationNumber;
  stationB: StationNumber;
  correlationR: number;
  narrative: string;
}

// ─── LEXICON ─────────────────────────────────────────────────

export type ImageryFamily =
  | 'architecture_light'
  | 'ecological_growth'
  | 'oceanic_navigation'
  | 'musical_composition'
  | 'astronomical_orbit'
  | 'textile_weaving'
  | 'flame_forge'
  | 'garden_cultivation'
  | 'wind_sky'
  | 'crystalline_geometry';

export interface LexiconProfile {
  primaryFamily: ImageryFamily;
  secondaryAccent: ImageryFamily | null;
  toneRatio: string;
  colorCue: 'gold_dominant' | 'emerald_dominant' | 'teal_dominant';
  topMetaphors: string[];
  topVerbs: string[];
}

// ─── INTEGRATION LETTER ──────────────────────────────────────

export interface IntegrationLetter {
  title: string;
  acknowledgement: string;
  keyPattern: string;
  invitation: string;
  coreCompass: string;
  geometryOfFlow: string;
  signatureMoment: string;
  continuation: string;
  fullMarkdown: string;
}

// ─── PRACTICE SUITE ──────────────────────────────────────────

export type SenseAxis = 'mind' | 'body' | 'heart' | 'intuition' | 'eye_ear' | 'spirit';

export interface PracticeCard {
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  senseAxis: SenseAxis;
  title: string;
  movementLine: string;
  ritualPosture: string;
  bespokeParagraph: string;
}

// ─── HEATMAP ─────────────────────────────────────────────────

export type ColorBand = 'gold' | 'emerald' | 'teal';

export interface HeatmapData {
  stationValues: Record<string, number>;
  colorBands: Record<string, ColorBand>;
  peakZone: string;
  waitingZone: string | null;
}

// ─── RECALIBRATION ───────────────────────────────────────────

export interface RecalibrationRhythm {
  naturalTempo: string;
  gravityPhase: string;
  gracePhase: string;
  rhythmBand: 'gravity_lead' | 'balanced' | 'grace_lead';
  guidance: string;
}

// ─── DIRECTION MAP ──────────────────────────────────────────

export interface DirectionCard {
  title: string;
  confidence: 'gold' | 'emerald' | 'teal';
  whyThisFits: string;
  whereThisLives: string[];
  entryPoints: string[];
  yourEdge: string;
  evidenceStations: number[];
}

export interface DirectionMap {
  directions: DirectionCard[];
  summary: string;
  generatedAt: string;
}

// ─── PODCAST ────────────────────────────────────────────────

export interface PodcastScript {
  title: string;
  script: string;
  chapters: { name: string; startWord: number }[];
  wordCount: number;
  estimatedDurationSeconds: number;
}

export interface PodcastAudio {
  storagePath: string;
  durationSeconds: number;
  fileSizeBytes: number;
  format: string;
}

// ─── FULL DELIVERABLE PACKAGE ────────────────────────────────

export interface DeliverablePackage {
  coherenceScores: CoherenceScore[];
  compassAnalytics: CompassAnalytics;
  blindSpots: BlindSpotFlag[];
  synergyPairs: SynergyPair[];
  lexiconProfile: LexiconProfile;
  heatmapData: HeatmapData;
  integrationLetter: IntegrationLetter;
  practiceCards: PracticeCard[];
  recalibration: RecalibrationRhythm;
  directionMap?: DirectionMap;
  podcastScript?: PodcastScript;
}

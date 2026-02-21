import { create } from 'zustand';
import { DiagnosticSession, StationResponse } from './types';
import { DIAGNOSTIC_ORDER, TOTAL_STEPS } from '@/config/stations';

/**
 * AUREA Client-Side State Management
 *
 * Manages the diagnostic form state with auto-save capability.
 * Uses Zustand for minimal, reactive state management.
 */

interface DiagnosticStore {
  // State
  session: DiagnosticSession;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setStationResponse: (station: number, response: Partial<StationResponse>) => void;
  setIntegrationMeta: (meta: Partial<DiagnosticSession['integrationMeta']>) => void;
  setLifeArc: (arc: Partial<DiagnosticSession['lifeArc']>) => void;
  nextStation: () => void;
  prevStation: () => void;
  goToStation: (index: number) => void;
  setSubmitting: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

const initialSession: DiagnosticSession = {
  responses: {},
  integrationMeta: { feeling: '', osName: '', lexiconChoice: '' },
  lifeArc: { shortTerm: '', midTerm: '', longTerm: '' },
  completionPercent: 0,
  currentStation: 0,
};

function computeCompletion(session: DiagnosticSession): number {
  const stationsDone = Object.keys(session.responses).length;
  const metaDone = [
    session.integrationMeta.feeling,
    session.lifeArc.shortTerm,
    session.lifeArc.midTerm,
    session.lifeArc.longTerm,
  ].filter(Boolean).length;

  return Math.round(((stationsDone + metaDone) / TOTAL_STEPS) * 100);
}

export const useDiagnosticStore = create<DiagnosticStore>((set, get) => ({
  session: initialSession,
  isSubmitting: false,
  error: null,

  setStationResponse: (station, response) => {
    set(state => {
      const existing = state.session.responses[station] || {
        station: station as any,
        primary: '',
        secondary: '',
        reflection: '',
      };
      const updated = { ...existing, ...response };
      const newResponses = { ...state.session.responses, [station]: updated };
      const newSession = { ...state.session, responses: newResponses };
      newSession.completionPercent = computeCompletion(newSession);
      return { session: newSession };
    });
  },

  setIntegrationMeta: (meta) => {
    set(state => {
      const newMeta = { ...state.session.integrationMeta, ...meta };
      const newSession = { ...state.session, integrationMeta: newMeta };
      newSession.completionPercent = computeCompletion(newSession);
      return { session: newSession };
    });
  },

  setLifeArc: (arc) => {
    set(state => {
      const newArc = { ...state.session.lifeArc, ...arc };
      const newSession = { ...state.session, lifeArc: newArc };
      newSession.completionPercent = computeCompletion(newSession);
      return { session: newSession };
    });
  },

  nextStation: () => {
    set(state => ({
      session: {
        ...state.session,
        currentStation: Math.min(state.session.currentStation + 1, TOTAL_STEPS - 1),
      },
    }));
  },

  prevStation: () => {
    set(state => ({
      session: {
        ...state.session,
        currentStation: Math.max(state.session.currentStation - 1, 0),
      },
    }));
  },

  goToStation: (index) => {
    set(state => ({
      session: {
        ...state.session,
        currentStation: Math.max(0, Math.min(index, TOTAL_STEPS - 1)),
      },
    }));
  },

  setSubmitting: (v) => set({ isSubmitting: v }),
  setError: (e) => set({ error: e }),
  reset: () => set({ session: initialSession, isSubmitting: false, error: null }),
}));

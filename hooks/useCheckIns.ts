import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import type { NervousSystemState } from '../constants/exercises';

export interface CheckIn {
  id: string;
  state: NervousSystemState;
  timestamp: number;
  note?: string;
}

const STORAGE_KEY = 'regulate_checkins';

function load(): CheckIn[] {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  return [];
}

function save(data: CheckIn[]) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {/* ignore */}
  }
}

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => { setCheckIns(load()); }, []);

  const addCheckIn = useCallback((state: NervousSystemState, note?: string) => {
    const entry: CheckIn = { id: Date.now().toString(), state, timestamp: Date.now(), note };
    setCheckIns((prev) => {
      const next = [entry, ...prev].slice(0, 90);
      save(next);
      return next;
    });
    return entry;
  }, []);

  const clearAll = useCallback(() => { setCheckIns([]); save([]); }, []);

  return { checkIns, addCheckIn, clearAll };
}

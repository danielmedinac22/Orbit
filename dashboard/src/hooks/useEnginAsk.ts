import { useState, useCallback } from 'react';
import type { EnginAskState } from '../types/orbit';

export function useEnginAsk() {
  const [states, setStates] = useState<Map<string, EnginAskState>>(new Map());

  const isBusy = Array.from(states.values()).some(s => s.loading);

  const ask = useCallback(async (itemId: string, prompt: string) => {
    setStates(prev => {
      const next = new Map(prev);
      next.set(itemId, { loading: true, response: null, error: null });
      return next;
    });

    try {
      const res = await fetch('/api/claude/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStates(prev => {
          const next = new Map(prev);
          next.set(itemId, { loading: false, response: null, error: data.error || 'Failed' });
          return next;
        });
        return;
      }

      setStates(prev => {
        const next = new Map(prev);
        next.set(itemId, { loading: false, response: data.response, error: null });
        return next;
      });
    } catch (err) {
      setStates(prev => {
        const next = new Map(prev);
        next.set(itemId, { loading: false, response: null, error: String(err) });
        return next;
      });
    }
  }, []);

  const dismiss = useCallback((itemId: string) => {
    setStates(prev => {
      const next = new Map(prev);
      next.delete(itemId);
      return next;
    });
  }, []);

  const getState = useCallback((itemId: string): EnginAskState | undefined => {
    return states.get(itemId);
  }, [states]);

  return { ask, dismiss, getState, isBusy };
}

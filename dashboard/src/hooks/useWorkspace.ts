import { useState, useEffect, useCallback } from 'react';
import type { WorkspaceStats, Note, Theme, ActionItem, Decision, Brief, CopilotData, ThemeDetail } from '../types/orbit';

function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);

  useEffect(() => { refetch(); }, [refetch, ...deps]);

  return { data, loading, refetch };
}

export function useWorkspace() {
  return useFetch<WorkspaceStats>('/api/workspace');
}

export function useCopilot() {
  return useFetch<CopilotData>('/api/copilot');
}

export function useNotes(theme?: string) {
  const url = theme ? `/api/notes?theme=${encodeURIComponent(theme)}` : '/api/notes';
  return useFetch<Note[]>(url, [theme]);
}

export function useNote(slug: string | null) {
  const url = slug ? `/api/notes/${slug}` : null;
  const [data, setData] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) { setData(null); return; }
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [url]);

  return { data, loading };
}

export function useThemes() {
  return useFetch<Theme[]>('/api/themes');
}

export function useTheme(name: string | null) {
  const [data, setData] = useState<ThemeDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) { setData(null); return; }
    setLoading(true);
    fetch(`/api/themes/${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [name]);

  return { data, loading };
}

export interface ActionItemsResponse {
  items: ActionItem[];
  configName: string;
}

export function useActionItems(owner?: string) {
  const url = owner ? `/api/action-items?owner=${encodeURIComponent(owner)}` : '/api/action-items';
  return useFetch<ActionItemsResponse>(url, [owner]);
}

export function useAllActionItems() {
  return useFetch<ActionItemsResponse>('/api/action-items?all=true');
}

export function useDecisions() {
  return useFetch<Decision[]>('/api/decisions');
}

export function useBriefs() {
  return useFetch<Brief[]>('/api/briefs');
}

export function useBrief(slug: string | null) {
  const [data, setData] = useState<{ slug: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) { setData(null); return; }
    setLoading(true);
    fetch(`/api/briefs/${slug}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  return { data, loading };
}

import { useState, useCallback } from 'react';
import { useNotes, useNote } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

const SOURCE_ICONS: Record<string, string> = {
  granola: '🎙',
  jira: '🎫',
  slack: '💬',
  file: '📄',
  paste: '📋',
};

interface Props {
  onClaude: (action: ClaudeAction) => void;
  initialSlug?: string;
}

export function SignalList({ onClaude, initialSlug }: Props) {
  const { data: notes, loading, refetch } = useNotes();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const { data: selectedNote } = useNote(selectedSlug);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const deleteNote = useCallback(async (slug: string) => {
    await fetch(`/api/notes/${slug}`, { method: 'DELETE' });
    setSelectedSlug(null);
    setConfirmDelete(null);
    refetch();
  }, [refetch]);

  if (selectedNote) {
    return (
      <>
        <Header
          title={selectedNote.title}
          actions={[
            { label: 'Ask Engin', action: { action: 'orbit-theme', prompt: `Analyze the note "${selectedNote.title}"` } },
          ]}
          onClaude={onClaude}
        />
        <div className="content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <a className="back-link" onClick={() => setSelectedSlug(null)}>
              ← Back to Signals
            </a>
            {confirmDelete === selectedNote.slug ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-drifting)' }}>Delete this signal?</span>
                <button
                  onClick={() => deleteNote(selectedNote.slug)}
                  style={{ background: 'var(--status-drifting)', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(selectedNote.slug)}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                Delete
              </button>
            )}
          </div>
          <div className="detail-header">
            <div className="detail-meta">
              <span>{SOURCE_ICONS[selectedNote.source] || '📄'} {selectedNote.source}</span>
              <span>{selectedNote.date}</span>
              {selectedNote.participants.length > 0 && (
                <span>{selectedNote.participants.join(', ')}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {selectedNote.themes.map(t => (
              <span key={t} className="badge badge-theme">{t}</span>
            ))}
          </div>
          {selectedNote.decisions.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">Decisions</div>
              <ul style={{ paddingLeft: 16 }}>
                {selectedNote.decisions.map((d, i) => <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{d}</li>)}
              </ul>
            </div>
          )}
          {selectedNote.action_items.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">Action Items</div>
              <ul style={{ paddingLeft: 16 }}>
                {selectedNote.action_items.map((a, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>
                    {a.text} {a.owner && <span style={{ color: 'var(--text-muted)' }}>— {a.owner}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedNote.body && (
            <div className="card">
              <div className="md-content" dangerouslySetInnerHTML={{ __html: selectedNote.body }} />
            </div>
          )}
        </div>
      </>
    );
  }

  const allThemes = [...new Set((notes || []).flatMap(n => n.themes))];
  const filtered = themeFilter
    ? (notes || []).filter(n => n.themes.includes(themeFilter))
    : notes || [];

  return (
    <>
      <Header title="Signals" />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◇</div>
            <div className="empty-state-title">No signals captured</div>
            <div className="empty-state-text">Run <code>/orbit-ingest</code> in Claude Code to capture your first notes.</div>
          </div>
        ) : (
          <>
            {allThemes.length > 0 && (
              <div className="filters">
                <button
                  className={`filter-chip ${!themeFilter ? 'active' : ''}`}
                  onClick={() => setThemeFilter(null)}
                >
                  All
                </button>
                {allThemes.map(t => (
                  <button
                    key={t}
                    className={`filter-chip ${themeFilter === t ? 'active' : ''}`}
                    onClick={() => setThemeFilter(themeFilter === t ? null : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div className="card">
              {filtered.map(note => (
                <div key={note.slug} className="list-item" onClick={() => setSelectedSlug(note.slug)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{SOURCE_ICONS[note.source] || '📄'}</span>
                      <strong>{note.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {note.date}
                      {note.participants.length > 0 && ` · ${note.participants.slice(0, 3).join(', ')}`}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {note.themes.slice(0, 2).map(t => (
                      <span key={t} className="badge badge-theme">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

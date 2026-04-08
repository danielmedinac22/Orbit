import { useState, useCallback } from 'react';
import { useNotes, useNote } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

const SOURCE_CONFIG: Record<string, { icon: string; badgeClass: string; label: string }> = {
  granola: { icon: 'auto_stories', badgeClass: 'badge-source-granola', label: 'Granola' },
  jira: { icon: 'confirmation_number', badgeClass: 'badge-source-jira', label: 'Jira' },
  slack: { icon: 'chat', badgeClass: 'badge-source-slack', label: 'Slack' },
  file: { icon: 'attach_file', badgeClass: 'badge-source-file', label: 'File' },
  paste: { icon: 'content_paste', badgeClass: 'badge-source-paste', label: 'Paste' },
};

const DEFAULT_SOURCE = { icon: 'article', badgeClass: 'badge-source', label: 'Note' };

interface Props {
  onClaude: (action: ClaudeAction) => void;
  initialSlug?: string;
}

function getTimeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return '1d ago';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return dateStr;
}

export function SignalList({ onClaude, initialSlug }: Props) {
  const { data: notes, loading, refetch } = useNotes();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const { data: selectedNote } = useNote(selectedSlug);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);

  const deleteNote = useCallback(async (slug: string) => {
    await fetch(`/api/notes/${slug}`, { method: 'DELETE' });
    setSelectedSlug(null);
    setConfirmDelete(null);
    refetch();
  }, [refetch]);

  // Detail view
  if (selectedNote) {
    const src = SOURCE_CONFIG[selectedNote.source] || DEFAULT_SOURCE;
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
              <span className="material-symbols-rounded">arrow_back</span> Back to Signals
            </a>
            {confirmDelete === selectedNote.slug ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-danger)' }}>Delete this signal?</span>
                <button className="btn btn-sm" style={{ background: 'rgba(248, 113, 113, 0.15)', color: 'var(--status-danger)', borderColor: 'rgba(248, 113, 113, 0.3)' }} onClick={() => deleteNote(selectedNote.slug)}>
                  Confirm
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmDelete(selectedNote.slug)}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>delete</span> Delete
              </button>
            )}
          </div>
          <div className="detail-header">
            <div className="detail-meta">
              <span className={`badge ${src.badgeClass}`}>
                <span className="material-symbols-rounded" style={{ fontSize: '0.8rem' }}>{src.icon}</span>
                {src.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{selectedNote.date}</span>
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
              <div className="section-title">
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>gavel</span>
                Decisions
              </div>
              <ul style={{ paddingLeft: 16 }}>
                {selectedNote.decisions.map((d, i) => <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{d}</li>)}
              </ul>
            </div>
          )}
          {selectedNote.action_items.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">
                <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>diamond</span>
                Action Items
              </div>
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
  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <Header
        title="Signals"
        actions={[
          { label: 'Export', action: { action: '', prompt: 'Export all signals to a summary document' } },
        ]}
        onClaude={onClaude}
      />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>sensors</span></div>
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

            {/* Signal Rows */}
            <div>
              {visible.map((note, idx) => {
                const src = SOURCE_CONFIG[note.source] || DEFAULT_SOURCE;
                const isExpanded = expandedSlug === note.slug;
                const firstQuote = note.decisions?.[0] || (note.action_items?.[0]?.text);

                return (
                  <div key={note.slug} className={`signal-row ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      className="signal-row-header"
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedSlug(null);
                        } else {
                          setExpandedSlug(note.slug);
                        }
                      }}
                    >
                      <div className="signal-row-icon">
                        <span className="material-symbols-rounded">{src.icon}</span>
                      </div>
                      <div className="signal-row-content">
                        <div className="signal-row-title">
                          {note.title}
                          <span className={`badge ${src.badgeClass}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{src.label}</span>
                        </div>
                        <div className="signal-row-desc">
                          {note.participants.length > 0
                            ? note.participants.slice(0, 3).join(', ')
                            : note.themes.slice(0, 2).join(', ') || 'Signal captured'
                          }
                        </div>
                      </div>
                      <span className="signal-row-time">{getTimeAgo(note.date)}</span>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="signal-row-detail">
                        {note.participants.length > 0 && (
                          <div className="signal-row-detail-meta">
                            Participants: {note.participants.map(p => `@${p}`).join(', ')}
                          </div>
                        )}
                        {note.themes.length > 0 && (
                          <div className="signal-row-detail-themes">
                            Themes: {note.themes.map(t => `#${t.replace(/\s+/g, '_')}`).join(', ')}
                          </div>
                        )}
                        {firstQuote && (
                          <div className="signal-row-detail-quote">
                            {firstQuote}
                          </div>
                        )}
                        <div style={{ marginTop: 12 }}>
                          <button className="btn btn-sm" onClick={() => setSelectedSlug(note.slug)}>
                            <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>open_in_new</span>
                            View Full Signal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {visibleCount < filtered.length && (
              <button className="load-more" onClick={() => setVisibleCount(c => c + 15)}>
                <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>history</span>
                Load Historical Signals ({filtered.length - visibleCount} remaining)
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

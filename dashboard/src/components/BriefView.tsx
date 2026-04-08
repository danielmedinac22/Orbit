import { useState } from 'react';
import { useBriefs, useBrief } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

const TYPE_CONFIG: Record<string, { label: string; badgeClass: string; icon: string }> = {
  daily: { label: 'Daily', badgeClass: 'badge-daily', icon: 'today' },
  weekly: { label: 'Weekly', badgeClass: 'badge-weekly', icon: 'date_range' },
  prep: { label: 'Prep', badgeClass: 'badge-prep', icon: 'event_note' },
};

const DEFAULT_TYPE = { label: 'Brief', badgeClass: 'badge-source', icon: 'description' };

interface Props {
  onClaude: (action: ClaudeAction) => void;
}

export function BriefView({ onClaude }: Props) {
  const { data: briefs, loading } = useBriefs();
  const [selected, setSelected] = useState<string | null>(null);
  const { data: detail } = useBrief(selected);

  if (selected && detail) {
    return (
      <>
        <Header title={`Brief: ${selected}`} />
        <div className="content">
          <a className="back-link" onClick={() => setSelected(null)}>
            <span className="material-symbols-rounded">arrow_back</span> Back to Briefs
          </a>
          <div className="card">
            <div className="md-content" dangerouslySetInnerHTML={{ __html: detail.content }} />
          </div>
        </div>
      </>
    );
  }

  const briefCount = briefs?.length || 0;

  return (
    <>
      <Header
        title="Briefs"
        actions={[
          { label: 'Daily Brief', action: { action: 'orbit-brief' } },
          { label: 'Weekly Brief', action: { action: 'orbit-brief', args: 'weekly' } },
        ]}
        onClaude={onClaude}
      />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !briefs || briefs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>description</span></div>
            <div className="empty-state-title">No briefs generated</div>
            <div className="empty-state-text">Click "Daily Brief" above or run <code>/orbit-brief</code> in Claude Code.</div>
          </div>
        ) : (
          <>
            {/* Asymmetric Stats Row */}
            <div className="bento-grid" style={{ marginBottom: 20 }}>
              <div className="bento-8">
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="stats-footer-label">Active Intelligence Feed</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      Synchronizing <strong style={{ color: 'var(--text-primary)' }}>{briefCount}</strong> Mission Briefs
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--primary)' }}>14ms</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Latency</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="claude-dot-pulse" />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bento-4">
                <div className="card" style={{ background: 'rgba(79, 49, 156, 0.12)' }}>
                  <div className="stats-footer-label" style={{ color: 'var(--secondary)', marginBottom: 8 }}>Quick Action</div>
                  <button className="btn btn-primary btn-full" onClick={() => onClaude({ action: 'orbit-brief' })}>
                    <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>auto_awesome</span>
                    Generate Synthesis
                  </button>
                </div>
              </div>
            </div>

            {/* Manifest Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', background: 'var(--surface-container)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Manifest ID & Classification
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Access
                  </span>
                </div>
              </div>
              {briefs.map((b, idx) => {
                const typeConf = TYPE_CONFIG[b.type] || DEFAULT_TYPE;
                const manifestId = String(idx + 1).padStart(5, '0');
                return (
                  <div
                    key={b.slug}
                    className="list-item"
                    style={{ padding: '14px 18px' }}
                    onClick={() => setSelected(b.slug)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span className={`badge ${typeConf.badgeClass}`}>
                          <span className="material-symbols-rounded" style={{ fontSize: '0.75rem' }}>{typeConf.icon}</span>
                          {typeConf.label}
                        </span>
                        <strong style={{ fontSize: '0.9rem' }}>{b.slug}</strong>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 2 }}>
                        ID: {manifestId}-A // STARDATE: {b.date}
                      </div>
                    </div>
                    <span style={{ color: 'var(--primary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      View Markdown
                      <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>open_in_new</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

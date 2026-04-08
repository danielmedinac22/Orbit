import { useState } from 'react';
import { useThemes, useTheme } from '../hooks/useWorkspace';
import { useEnginAsk } from '../hooks/useEnginAsk';
import { getQuestionCTAs } from '../utils/prompts';
import { EnginDropdown } from './EnginDropdown';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
  onNavigate: (view: string, detail?: string) => void;
  initialDetail?: string;
}

export function ConstellationList({ onClaude, onNavigate, initialDetail }: Props) {
  const { data: themes, loading } = useThemes();
  const [selected, setSelected] = useState<string | null>(initialDetail || null);
  const { data: detail } = useTheme(selected);
  const engin = useEnginAsk();

  if (selected && detail) {
    const openMissions = detail.missions.filter(m => (m.status || '').toLowerCase() !== 'done' && (m.status || '').toLowerCase() !== 'completed');
    return (
      <>
        <Header title={`★ ${detail.name}`} />
        <div className="content">
          <a className="back-link" onClick={() => setSelected(null)}>
            <span className="material-symbols-rounded">arrow_back</span> Back to Constellations
          </a>

          {/* Bento Grid Layout */}
          <div className="bento-grid">
            {/* Wide Card — Project Summary */}
            <div className="bento-8">
              <div className="constellation-summary" style={{ height: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
                  <div className="constellation-stat">
                    <span className="constellation-stat-value">
                      <span className="status-orbit status-orbit-primary" />
                      {detail.signals.length}
                    </span>
                    <span className="constellation-stat-label">signals</span>
                  </div>
                  <div className="constellation-stat">
                    <span className="constellation-stat-value">{openMissions.length}</span>
                    <span className="constellation-stat-label">missions</span>
                  </div>
                  <div className="constellation-stat">
                    <span className="constellation-stat-value">{detail.decisions.length}</span>
                    <span className="constellation-stat-label">decisions</span>
                  </div>
                  <div className="constellation-stat">
                    <span className="constellation-stat-value">
                      {detail.questions.length > 0 && <span className="status-orbit status-orbit-error" />}
                      {detail.questions.length}
                    </span>
                    <span className="constellation-stat-label">questions</span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 12 }}>
                  {detail.signals.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Latest: <strong>{detail.signals[0].title}</strong> — <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{detail.signals[0].date}</span>
                      {detail.decisions.length > 0 && (
                        <span style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)' }}>
                          Last decision: {detail.decisions[0].length > 80 ? detail.decisions[0].slice(0, 77) + '...' : detail.decisions[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Card — Launch Pad */}
            <div className="bento-4">
              <div className="launch-pad" style={{ height: '100%' }}>
                <div className="section-title" style={{ marginBottom: 14 }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>rocket_launch</span>
                  Launch Pad
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => onClaude({ action: 'orbit-theme', args: detail.name })}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>bolt</span>
                    Ask Engin about this project
                  </button>
                  <button
                    className="btn btn-ghost btn-full"
                    onClick={() => onClaude({ action: 'orbit-artifact', args: `prd --theme ${detail.name}` })}
                  >
                    Generate PRD
                  </button>
                  <button
                    className="btn btn-ghost btn-full"
                    onClick={() => onClaude({ action: 'orbit-prep', args: detail.name })}
                  >
                    Prep next meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Decisions Card */}
            {detail.decisions.length > 0 && (
              <div className="bento-4">
                <div className="card" style={{ height: '100%' }}>
                  <div className="section-title" style={{ marginBottom: 12 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>gavel</span>
                    Decisions
                  </div>
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {detail.decisions.slice(0, 4).map((d, i) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 10, paddingLeft: 12, position: 'relative', fontSize: '0.88rem', lineHeight: 1.5 }}>
                        <span style={{ position: 'absolute', left: 0, top: 6, width: 5, height: 5, borderRadius: '50%', background: 'var(--tertiary)' }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Open Questions Card */}
            {detail.questions.length > 0 && (
              <div className="bento-4">
                <div className="card" style={{ height: '100%' }}>
                  <div className="section-title" style={{ marginBottom: 12 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>help_center</span>
                    Open Questions
                  </div>
                  <div style={{ background: 'rgba(248, 113, 113, 0.05)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                    {detail.questions.slice(0, 3).map((q, i) => {
                      const key = `const-q-${i}`;
                      const state = engin.getState(key);
                      return (
                        <div key={i} style={{ marginBottom: i < Math.min(detail.questions.length, 3) - 1 ? 10 : 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--status-warning)', fontSize: '0.88rem' }}>{q}</span>
                            {!state && (
                              <EnginDropdown
                                itemKey={key}
                                ctas={getQuestionCTAs(q, detail.name, 0)}
                                state={state}
                                isBusy={engin.isBusy}
                                onAsk={engin.ask}
                                onDismiss={engin.dismiss}
                              />
                            )}
                          </div>
                          {state && (
                            <div style={{ marginTop: 6 }}>
                              <EnginDropdown
                                itemKey={key}
                                ctas={[]}
                                state={state}
                                isBusy={engin.isBusy}
                                onAsk={engin.ask}
                                onDismiss={engin.dismiss}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {detail.questions.length > 3 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 8 }}>
                        +{detail.questions.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Signals Card */}
            <div className={detail.decisions.length > 0 || detail.questions.length > 0 ? 'bento-4' : 'bento-12'}>
              <div className="card" style={{ height: '100%' }}>
                <div className="section-title" style={{ marginBottom: 12 }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>sensors</span>
                  Signals
                </div>
                {detail.signals.length === 0 ? (
                  <div style={{ padding: 16, color: 'var(--text-muted)', textAlign: 'center' }}>No signals yet</div>
                ) : (
                  detail.signals.slice(0, 5).map(s => (
                    <div key={s.slug} className="list-item" onClick={() => onNavigate('signals', s.slug)}>
                      <span style={{ fontSize: '0.88rem' }}><strong>{s.title}</strong></span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>{s.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Decorative Visualization */}
          <div className="orbital-viz" style={{ height: 180, marginTop: 8 }}>
            <div className="orbital-viz-grid" />
            <div className="orbital-ring orbital-ring-outer" />
            <div className="orbital-ring orbital-ring-mid" />
            <div className="orbital-ring orbital-ring-inner" />
            <div className="orbital-coords orbital-coords-left">
              <div>Longitude: {(Math.random() * 360).toFixed(1)}°</div>
              <div>Latitude: {(Math.random() * 90).toFixed(1)}°</div>
            </div>
            <div className="orbital-coords orbital-coords-right">
              <div>System Status: Operational</div>
              <div>Active Uplink: Established</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Calculate totals for stats row
  const totalSignals = (themes || []).reduce((sum, t) => sum + t.signalCount, 0);
  const totalMissions = (themes || []).reduce((sum, t) => sum + t.missionCount, 0);
  const activeCount = (themes || []).filter(t => t.type === 'active').length;

  return (
    <>
      <Header title="Constellations" />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !themes || themes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>star</span></div>
            <div className="empty-state-title">No constellations yet</div>
            <div className="empty-state-text">Themes are auto-detected when you ingest notes.</div>
          </div>
        ) : (
          <>
            {/* Asymmetric Stats Row */}
            <div className="bento-grid" style={{ marginBottom: 20 }}>
              <div className="bento-8">
                <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="stats-footer-label">System Health</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span className="stats-footer-value">{activeCount}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>active constellations</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      {totalSignals} signals &middot; {totalMissions} missions tracked
                    </div>
                  </div>
                  <div className="sparkline">
                    {[65, 80, 45, 90, 70, 85].map((h, i) => (
                      <div key={i} className="sparkline-bar" style={{ height: `${h}%`, opacity: 0.4 + (i * 0.12) }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bento-4">
                <div className="card" style={{ background: 'rgba(79, 49, 156, 0.15)' }}>
                  <div className="stats-footer-label" style={{ color: 'var(--secondary)' }}>Core Active</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', boxShadow: '0 0 10px var(--secondary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 550 }}>Sector Active</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {themes.length} constellations mapped
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="constellation-grid">
              {themes.map((t, idx) => (
                <div key={t.name} className="constellation-card card-clickable" onClick={() => setSelected(t.name)}>
                  <div className="constellation-card-header">
                    <span className="constellation-card-icon">
                      <span className={`material-symbols-rounded ${t.type === 'active' ? 'filled' : ''}`}>star</span>
                    </span>
                    <strong className="constellation-card-name">{t.name}</strong>
                    <span className="constellation-card-id">CN-{String(idx + 1).padStart(3, '0')}</span>
                    {t.type === 'suggested' && <span className="badge badge-status-stalled">suggested</span>}
                  </div>
                  {t.snippet && (
                    <div className="constellation-card-snippet">{t.snippet}</div>
                  )}
                  <div className="constellation-card-meta">
                    <span className="constellation-meta-dot constellation-meta-dot-primary" />
                    <span>{t.signalCount} signals</span>
                    <span className="constellation-card-dot">·</span>
                    <span className="constellation-meta-dot constellation-meta-dot-dim" />
                    <span>{t.missionCount} missions</span>
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

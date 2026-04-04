import { useState } from 'react';
import { useThemes, useTheme } from '../hooks/useWorkspace';
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

  if (selected && detail) {
    return (
      <>
        <Header
          title={`★ ${detail.name}`}
          actions={[
            { label: 'Deep-dive with Engin', action: { action: 'orbit-theme', args: detail.name } },
            { label: 'Generate PRD', action: { action: 'orbit-artifact', args: `prd --theme ${detail.name}` } },
          ]}
          onClaude={onClaude}
        />
        <div className="content">
          <a className="back-link" onClick={() => setSelected(null)}>← Back to Constellations</a>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="card stat-card">
              <div className="stat-value">{detail.signals.length}</div>
              <div className="stat-label">Signals</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{detail.missions.length}</div>
              <div className="stat-label">Missions</div>
            </div>
          </div>

          {detail.missions.length > 0 && (
            <>
              <div className="section-title">Active Missions</div>
              <div className="card" style={{ marginBottom: 24 }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Task</th>
                        <th>Owner</th>
                        <th>Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.missions.map((m, i) => (
                        <tr key={i}>
                          <td>{m.task}</td>
                          <td>{m.owner}</td>
                          <td>{m.due}</td>
                          <td>
                            <span className={`badge badge-status-${m.status === 'pending' ? 'pending' : 'drifting'}`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {detail.decisions.length > 0 && (
            <>
              <div className="section-title">Coordinates</div>
              <div className="card" style={{ marginBottom: 24 }}>
                <ul style={{ paddingLeft: 16 }}>
                  {detail.decisions.map((d, i) => (
                    <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>{d}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {detail.questions.length > 0 && (
            <>
              <div className="section-title">Open Questions</div>
              <div className="card" style={{ marginBottom: 24 }}>
                <ul style={{ paddingLeft: 16 }}>
                  {detail.questions.map((q, i) => (
                    <li key={i} style={{ color: 'var(--status-warning)', marginBottom: 6 }}>{q}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="section-title">Signals</div>
          <div className="card">
            {detail.signals.map(s => (
              <div key={s.slug} className="list-item" onClick={() => onNavigate('signals', s.slug)}>
                <span><strong>{s.title}</strong></span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Constellations" />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !themes || themes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">★</div>
            <div className="empty-state-title">No constellations yet</div>
            <div className="empty-state-text">Themes are auto-detected when you ingest notes.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {themes.map(t => (
              <div key={t.name} className="card card-clickable" onClick={() => setSelected(t.name)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.2rem' }}>{t.type === 'active' ? '★' : '○'}</span>
                  <strong style={{ fontSize: '1.05rem' }}>{t.name}</strong>
                  {t.type === 'suggested' && <span className="badge badge-status-stalled">suggested</span>}
                </div>
                <div style={{ display: 'flex', gap: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>{t.signalCount} signals</span>
                  <span>{t.missionCount} missions</span>
                </div>
                {t.latestSignalDate && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    Latest: {t.latestSignalDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

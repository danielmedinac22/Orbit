import { useWorkspace, useThemes } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
  onNavigate: (view: string, detail?: string) => void;
}

export function StationOverview({ onClaude, onNavigate }: Props) {
  const { data: stats, loading } = useWorkspace();
  const { data: themes } = useThemes();

  if (loading || !stats) {
    return (
      <>
        <Header title="Station Overview" />
        <div className="content">
          <div className="empty-state">
            <div className="empty-state-icon">◉</div>
            <div className="empty-state-title">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!stats.initialized) {
    return (
      <>
        <Header title="Station Overview" />
        <div className="content">
          <div className="empty-state">
            <div className="empty-state-icon">◉</div>
            <div className="empty-state-title">Orbit not initialized</div>
            <div className="empty-state-text">
              Run <code>/orbit-init</code> in Claude Code to set up your workspace.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Station Overview"
        actions={[
          { label: '◇ Ingest', action: { action: 'orbit-ingest' } },
          { label: '◫ Brief', action: { action: 'orbit-brief' } },
        ]}
        onClaude={onClaude}
      />
      <div className="content">
        {stats.config && (
          <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
            {stats.config.name} &middot; {stats.config.role} {stats.config.company ? `@ ${stats.config.company}` : ''}
          </p>
        )}

        <div className="stat-grid">
          <div className="card stat-card card-clickable" onClick={() => onNavigate('signals')}>
            <div className="stat-value">{stats.signals.total}</div>
            <div className="stat-label">Signals</div>
            {stats.signals.thisWeek > 0 && (
              <div className="stat-sub">{stats.signals.thisWeek} this week</div>
            )}
          </div>
          <div className="card stat-card card-clickable" onClick={() => onNavigate('constellations')}>
            <div className="stat-value">{stats.constellations.active}</div>
            <div className="stat-label">Constellations</div>
            {stats.constellations.suggested > 0 && (
              <div className="stat-sub">{stats.constellations.suggested} suggested</div>
            )}
          </div>
          <div className="card stat-card card-clickable" onClick={() => onNavigate('missions')}>
            <div className="stat-value">{stats.missions.active}</div>
            <div className="stat-label">Missions</div>
            {stats.missions.drifting > 0 && (
              <div className="stat-sub" style={{ color: 'var(--status-drifting)' }}>
                {stats.missions.drifting} drifting
              </div>
            )}
          </div>
          <div className="card stat-card card-clickable" onClick={() => onNavigate('coordinates')}>
            <div className="stat-value">{stats.coordinates.confirmed}</div>
            <div className="stat-label">Coordinates</div>
            {stats.coordinates.conflicting > 0 && (
              <div className="stat-sub" style={{ color: 'var(--status-conflicting)' }}>
                {stats.coordinates.conflicting} conflicting
              </div>
            )}
          </div>
        </div>

        {themes && themes.length > 0 && (
          <>
            <div className="section-title">Constellations</div>
            <div className="card">
              {themes.map(t => (
                <div
                  key={t.name}
                  className="list-item"
                  onClick={() => onNavigate('constellations', t.name)}
                >
                  <div>
                    <span style={{ marginRight: 8 }}>{t.type === 'active' ? '★' : '○'}</span>
                    <strong>{t.name}</strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 12, fontSize: '0.85rem' }}>
                      {t.signalCount} signals &middot; {t.missionCount} missions
                    </span>
                  </div>
                  {t.type === 'suggested' && (
                    <span className="badge badge-status-stalled">suggested</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

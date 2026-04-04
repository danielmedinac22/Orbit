import { useDecisions } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
}

export function CoordinateLog({ onClaude }: Props) {
  const { data: decisions, loading } = useDecisions();

  return (
    <>
      <Header
        title="Coordinates"
        actions={[{ label: 'Audit Decisions', action: { action: 'orbit-decisions' } }]}
        onClaude={onClaude}
      />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !decisions || decisions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⊕</div>
            <div className="empty-state-title">No coordinates logged</div>
            <div className="empty-state-text">Decisions are extracted automatically when you ingest notes.</div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Decision</th>
                    <th>Source</th>
                    <th>Theme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((d, i) => (
                    <tr key={i}>
                      <td style={{ whiteSpace: 'nowrap' }}>{d.date}</td>
                      <td>{d.decision}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.source}</td>
                      <td>{d.theme && <span className="badge badge-theme">{d.theme}</span>}</td>
                      <td>
                        <span className={`badge badge-status-${d.status}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

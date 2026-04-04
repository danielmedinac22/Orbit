import { useActionItems } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
}

export function MissionBoard({ onClaude }: Props) {
  const { data: items, loading } = useActionItems();

  const drifting = (items || []).filter(i => i.drifting);
  const active = (items || []).filter(i => !i.drifting && i.status !== 'done' && i.status !== 'completed');
  const done = (items || []).filter(i => i.status === 'done' || i.status === 'completed');

  return (
    <>
      <Header
        title="Missions"
        actions={[{ label: 'Priority Scan', action: { action: 'orbit-priorities' } }]}
        onClaude={onClaude}
      />
      <div className="content">
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !items || items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">No missions tracked</div>
            <div className="empty-state-text">Action items are extracted automatically when you ingest notes.</div>
          </div>
        ) : (
          <>
            {drifting.length > 0 && (
              <>
                <div className="section-title" style={{ color: 'var(--status-drifting)' }}>
                  Drifting ({drifting.length})
                </div>
                <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Task</th><th>Owner</th><th>Due</th><th>Theme</th></tr></thead>
                      <tbody>
                        {drifting.map((item, i) => (
                          <tr key={i}>
                            <td style={{ color: 'var(--status-drifting)' }}>{item.task}</td>
                            <td>{item.owner}</td>
                            <td style={{ color: 'var(--status-drifting)' }}>{item.due}</td>
                            <td>{item.theme && <span className="badge badge-theme">{item.theme}</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {active.length > 0 && (
              <>
                <div className="section-title">Active ({active.length})</div>
                <div className="card" style={{ marginBottom: 24 }}>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Task</th><th>Owner</th><th>Due</th><th>Theme</th></tr></thead>
                      <tbody>
                        {active.map((item, i) => (
                          <tr key={i}>
                            <td>{item.task}</td>
                            <td>{item.owner}</td>
                            <td>{item.due}</td>
                            <td>{item.theme && <span className="badge badge-theme">{item.theme}</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {done.length > 0 && (
              <>
                <div className="section-title" style={{ opacity: 0.5 }}>Done ({done.length})</div>
                <div className="card" style={{ opacity: 0.5 }}>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Task</th><th>Owner</th><th>Due</th><th>Theme</th></tr></thead>
                      <tbody>
                        {done.map((item, i) => (
                          <tr key={i}>
                            <td style={{ textDecoration: 'line-through' }}>{item.task}</td>
                            <td>{item.owner}</td>
                            <td>{item.due}</td>
                            <td>{item.theme && <span className="badge badge-theme">{item.theme}</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

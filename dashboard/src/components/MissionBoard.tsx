import { useState, useCallback } from 'react';
import { useActionItems } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
}

type OwnerFilter = 'all' | 'mine' | 'others';

export function MissionBoard({ onClaude }: Props) {
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all');
  const { data: response, loading, refetch } = useActionItems();

  const items = response?.items || [];
  const configName = response?.configName || '';

  const filtered = ownerFilter === 'all'
    ? items
    : ownerFilter === 'mine'
      ? items.filter(i => i.owner.toLowerCase() === configName.toLowerCase())
      : items.filter(i => i.owner.toLowerCase() !== configName.toLowerCase());

  const drifting = filtered.filter(i => i.drifting);
  const active = filtered.filter(i => !i.drifting && i.status !== 'done' && i.status !== 'completed');
  const done = filtered.filter(i => i.status === 'done' || i.status === 'completed');

  const markDone = useCallback(async (index: number) => {
    await fetch(`/api/action-items/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
    });
    refetch();
  }, [refetch]);

  const deleteItem = useCallback(async (index: number) => {
    await fetch(`/api/action-items/${index}`, { method: 'DELETE' });
    refetch();
  }, [refetch]);

  const renderTable = (rows: typeof items, style?: React.CSSProperties) => (
    <div className="card" style={{ marginBottom: 24, ...style }}>
      <div className="table-wrap">
        <table>
          <thead><tr><th style={{ width: 36 }}></th><th>Task</th><th>Owner</th><th>Due</th><th>Theme</th><th style={{ width: 36 }}></th></tr></thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.index}>
                <td>
                  {item.status !== 'done' && item.status !== 'completed' && (
                    <button
                      title="Mark done"
                      onClick={() => markDone(item.index)}
                      style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', padding: '2px 6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}
                    >
                      ✓
                    </button>
                  )}
                </td>
                <td style={{
                  color: item.drifting ? 'var(--status-drifting)' : undefined,
                  textDecoration: item.status === 'done' || item.status === 'completed' ? 'line-through' : undefined,
                }}>{item.task}</td>
                <td>{item.owner}</td>
                <td style={{ color: item.drifting ? 'var(--status-drifting)' : undefined }}>{item.due}</td>
                <td>{item.theme && <span className="badge badge-theme">{item.theme}</span>}</td>
                <td>
                  <button
                    title="Delete"
                    onClick={() => deleteItem(item.index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '2px 6px' }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◈</div>
            <div className="empty-state-title">No missions tracked</div>
            <div className="empty-state-text">Action items are extracted automatically when you ingest notes.</div>
          </div>
        ) : (
          <>
            {configName && (
              <div className="filters">
                <button
                  className={`filter-chip ${ownerFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setOwnerFilter('all')}
                >
                  All ({items.length})
                </button>
                <button
                  className={`filter-chip ${ownerFilter === 'mine' ? 'active' : ''}`}
                  onClick={() => setOwnerFilter('mine')}
                >
                  Mine ({items.filter(i => i.owner.toLowerCase() === configName.toLowerCase()).length})
                </button>
                <button
                  className={`filter-chip ${ownerFilter === 'others' ? 'active' : ''}`}
                  onClick={() => setOwnerFilter('others')}
                >
                  Others ({items.filter(i => i.owner.toLowerCase() !== configName.toLowerCase()).length})
                </button>
              </div>
            )}

            {drifting.length > 0 && (
              <>
                <div className="section-title" style={{ color: 'var(--status-drifting)' }}>
                  Drifting ({drifting.length})
                </div>
                {renderTable(drifting, { borderColor: 'rgba(239, 68, 68, 0.2)' })}
              </>
            )}

            {active.length > 0 && (
              <>
                <div className="section-title">Active ({active.length})</div>
                {renderTable(active)}
              </>
            )}

            {done.length > 0 && (
              <>
                <div className="section-title" style={{ opacity: 0.5 }}>Done ({done.length})</div>
                {renderTable(done, { opacity: 0.5 })}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

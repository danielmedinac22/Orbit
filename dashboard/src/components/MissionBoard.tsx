import React, { useState, useCallback, useMemo } from 'react';
import { useActionItems, useAllActionItems } from '../hooks/useWorkspace';
import { useEnginAsk } from '../hooks/useEnginAsk';
import { getMissionCTAs } from '../utils/prompts';
import { EnginDropdown } from './EnginDropdown';
import { Header } from './layout/Header';
import type { ClaudeAction, AttentionReason } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
}

type ViewFilter = 'attention' | 'active' | 'all';
type OwnerFilter = 'mine' | 'all';

const PAGE_SIZE = 10;

const ATTENTION_CONFIG: Record<AttentionReason, { label: string; className: string; orbitClass: string; order: number }> = {
  'overdue': { label: 'Overdue', className: 'badge-attention-overdue', orbitClass: 'status-orbit-error', order: 1 },
  'blocked': { label: 'Blocked', className: 'badge-attention-blocked', orbitClass: 'status-orbit-warning', order: 2 },
  'needs-decision': { label: 'Decision needed', className: 'badge-attention-decision', orbitClass: 'status-orbit-secondary', order: 3 },
  'forgotten': { label: 'Forgotten', className: 'badge-attention-forgotten', orbitClass: 'status-orbit-warning', order: 4 },
  'stale': { label: 'Stale', className: 'badge-attention-stale', orbitClass: 'status-orbit-warning', order: 5 },
};

export function MissionBoard({ onClaude }: Props) {
  const [viewFilter, setViewFilter] = useState<ViewFilter>('attention');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('mine');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const engin = useEnginAsk();

  const { data: myResponse, loading: myLoading, refetch: myRefetch } = useActionItems();
  const { data: allResponse, loading: allLoading, refetch: allRefetch } = useAllActionItems();

  const response = ownerFilter === 'mine' ? myResponse : allResponse;
  const loading = ownerFilter === 'mine' ? myLoading : allLoading;
  const refetch = ownerFilter === 'mine' ? myRefetch : allRefetch;

  const items = response?.items || [];

  const filtered = viewFilter === 'all'
    ? items
    : viewFilter === 'attention'
      ? items.filter(i => i.attention !== null && i.status !== 'done' && i.status !== 'completed')
      : items.filter(i => i.attention === null && i.status !== 'done' && i.status !== 'completed');

  const sorted = [...filtered].sort((a, b) => {
    const aDone = a.status === 'done' || a.status === 'completed';
    const bDone = b.status === 'done' || b.status === 'completed';
    if (aDone && !bDone) return 1;
    if (!aDone && bDone) return -1;
    const aOrder = a.attention ? ATTENTION_CONFIG[a.attention].order : 99;
    const bOrder = b.attention ? ATTENTION_CONFIG[b.attention].order : 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    const aDue = a.due && a.due !== '—' && a.due !== '~' ? a.due : 'z';
    const bDue = b.due && b.due !== '—' && b.due !== '~' ? b.due : 'z';
    return aDue.localeCompare(bDue);
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Selection helpers
  const toggleSelect = useCallback((index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const selectAllOnPage = useCallback(() => {
    const pageIndices = paged.filter(i => i.status !== 'done' && i.status !== 'completed').map(i => i.index);
    setSelected(prev => {
      const allSelected = pageIndices.every(idx => prev.has(idx));
      if (allSelected) return new Set(); // deselect all
      return new Set([...prev, ...pageIndices]);
    });
  }, [paged]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  // Bulk actions
  const bulkMarkDone = useCallback(async () => {
    const indices = Array.from(selected);
    await Promise.all(indices.map(idx =>
      fetch(`/api/action-items/${idx}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      })
    ));
    setSelected(new Set());
    refetch();
  }, [selected, refetch]);

  const bulkDelete = useCallback(async () => {
    const indices = Array.from(selected);
    await Promise.all(indices.map(idx =>
      fetch(`/api/action-items/${idx}`, { method: 'DELETE' })
    ));
    setSelected(new Set());
    refetch();
  }, [selected, refetch]);

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

  const attentionCount = items.filter(i => i.attention !== null && i.status !== 'done' && i.status !== 'completed').length;
  const activeCount = items.filter(i => i.attention === null && i.status !== 'done' && i.status !== 'completed').length;
  const doneCount = items.filter(i => i.status === 'done' || i.status === 'completed').length;

  const velocity = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((doneCount / items.length) * 100);
  }, [items.length, doneCount]);

  const selectableOnPage = paged.filter(i => i.status !== 'done' && i.status !== 'completed');
  const allPageSelected = selectableOnPage.length > 0 && selectableOnPage.every(i => selected.has(i.index));

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
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>diamond</span></div>
            <div className="empty-state-title">No missions tracked</div>
            <div className="empty-state-text">Action items are extracted automatically when you ingest notes.</div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="filters" style={{ marginBottom: 0 }}>
                <button className={`filter-chip ${viewFilter === 'attention' ? 'active' : ''}`} onClick={() => { setViewFilter('attention'); setPage(0); clearSelection(); }}>
                  {attentionCount > 0 && <span className="status-orbit status-orbit-error" style={{ marginRight: 4 }} />}
                  Needs Attention ({attentionCount})
                </button>
                <button className={`filter-chip ${viewFilter === 'active' ? 'active' : ''}`} onClick={() => { setViewFilter('active'); setPage(0); clearSelection(); }}>Active ({activeCount})</button>
                <button className={`filter-chip ${viewFilter === 'all' ? 'active' : ''}`} onClick={() => { setViewFilter('all'); setPage(0); clearSelection(); }}>All ({items.length})</button>
              </div>
              <div className="owner-toggle">
                <button className={`owner-toggle-btn ${ownerFilter === 'mine' ? 'active' : ''}`} onClick={() => { setOwnerFilter('mine'); setPage(0); clearSelection(); }}>Mine</button>
                <button className={`owner-toggle-btn ${ownerFilter === 'all' ? 'active' : ''}`} onClick={() => { setOwnerFilter('all'); setPage(0); clearSelection(); }}>Everyone</button>
              </div>
            </div>

            {/* Bulk Action Bar */}
            {selected.size > 0 && (
              <div className="bulk-bar">
                <span className="bulk-bar-count">{selected.size} selected</span>
                <div className="bulk-bar-divider" />
                <div className="bulk-bar-actions">
                  <button className="btn btn-sm btn-primary" onClick={bulkMarkDone}>
                    <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>check_circle</span>
                    Mark Done
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ borderColor: 'rgba(248, 113, 113, 0.3)', color: 'var(--status-danger)' }}
                    onClick={bulkDelete}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>delete</span>
                    Delete
                  </button>
                </div>
                <button className="bulk-bar-deselect" onClick={clearSelection}>
                  Clear selection
                </button>
              </div>
            )}

            {/* Table */}
            {sorted.length === 0 ? (
              <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No items match this filter</div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 36 }}>
                          <button
                            className={`mission-checkbox ${allPageSelected ? 'checked' : ''}`}
                            title="Select all on this page"
                            onClick={selectAllOnPage}
                          >
                            {allPageSelected && <span className="material-symbols-rounded" style={{ fontSize: '0.75rem' }}>check</span>}
                          </button>
                        </th>
                        <th>Task</th>
                        <th>Owner</th>
                        <th>Due</th>
                        <th>Theme</th>
                        <th>Status</th>
                        <th style={{ width: 44 }}></th>
                        <th style={{ width: 36 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((item) => {
                        const isDone = item.status === 'done' || item.status === 'completed';
                        const isSelected = selected.has(item.index);
                        const key = `board-m-${item.index}`;
                        const state = engin.getState(key);
                        return (
                          <React.Fragment key={item.index}>
                            <tr
                              style={{ opacity: isDone ? 0.4 : 1 }}
                              className={isSelected ? 'row-selected' : ''}
                            >
                              <td>
                                {isDone ? (
                                  <button className="mission-checkbox checked" disabled>
                                    <span className="material-symbols-rounded" style={{ fontSize: '0.75rem' }}>check</span>
                                  </button>
                                ) : (
                                  <button
                                    className={`mission-checkbox ${isSelected ? 'checked' : ''}`}
                                    title={isSelected ? 'Deselect' : 'Select'}
                                    onClick={() => toggleSelect(item.index)}
                                  >
                                    {isSelected && <span className="material-symbols-rounded" style={{ fontSize: '0.75rem' }}>check</span>}
                                  </button>
                                )}
                              </td>
                              <td style={{ textDecoration: isDone ? 'line-through' : undefined }}>
                                <div style={{ fontWeight: 500 }}>{item.task}</div>
                                {item.attentionDetail && !isDone && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {item.attention === 'overdue' && <span className="material-symbols-rounded" style={{ fontSize: '0.8rem', color: 'var(--status-danger)' }}>warning</span>}
                                    {item.attentionDetail}
                                  </div>
                                )}
                              </td>
                              <td style={{ fontSize: '0.85rem' }}>{item.owner}</td>
                              <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: item.attention === 'overdue' ? 'var(--status-danger)' : undefined }}>{item.due}</td>
                              <td>{item.theme && <span className="badge badge-theme">{item.theme}</span>}</td>
                              <td>
                                {item.attention && !isDone ? (
                                  <span className={`badge ${ATTENTION_CONFIG[item.attention].className}`}>
                                    <span className={`status-orbit ${ATTENTION_CONFIG[item.attention].orbitClass}`} />
                                    {ATTENTION_CONFIG[item.attention].label}
                                  </span>
                                ) : isDone ? (
                                  <span className="badge badge-status-confirmed">
                                    <span className="status-orbit status-orbit-primary" />
                                    done
                                  </span>
                                ) : null}
                              </td>
                              <td>
                                {!isDone && (
                                  <EnginDropdown
                                    itemKey={key}
                                    ctas={getMissionCTAs(item.task, item.theme, item.due, item.attention)}
                                    state={state}
                                    isBusy={engin.isBusy}
                                    onAsk={engin.ask}
                                    onDismiss={engin.dismiss}
                                  />
                                )}
                              </td>
                              <td>
                                <button
                                  title="Delete"
                                  onClick={() => deleteItem(item.index)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.85rem', padding: '2px 4px', borderRadius: 4, transition: 'color 0.1s' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--status-danger)')}
                                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                                >
                                  <span className="material-symbols-rounded" style={{ fontSize: '0.95rem' }}>close</span>
                                </button>
                              </td>
                            </tr>
                            {state && (
                              <tr className="engin-response-row">
                                <td colSpan={8} style={{ padding: 0 }}>
                                  <EnginDropdown itemKey={key} ctas={[]} state={state} isBusy={engin.isBusy} onAsk={engin.ask} onDismiss={engin.dismiss} />
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <span className="pagination-info">{paged.length} items visible of {sorted.length}</span>
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button className="pagination-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        <span className="material-symbols-rounded">chevron_left</span>
                      </button>
                      <button className="pagination-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                        <span className="material-symbols-rounded">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div className="stats-footer">
              <div className="bento-grid">
                <div className="bento-8">
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div className="stats-footer-label">Operational Velocity</div>
                      <div className="stats-footer-value">{velocity}%</div>
                      <div className="stats-footer-label" style={{ marginTop: 8 }}>Completion Delta</div>
                    </div>
                    <div className="sparkline">
                      {[40, 55, 70, 50, 80, 65].map((h, i) => (
                        <div key={i} className="sparkline-bar" style={{ height: `${h}%`, opacity: 0.3 + (i * 0.14) }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bento-4">
                  <div className="ai-analysis-card">
                    <span className="ai-analysis-icon material-symbols-rounded">auto_awesome</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>AI Copilot Analysis</div>
                      <div className="ai-analysis-text">
                        {attentionCount > 0
                          ? `${attentionCount} items need attention. Focus on overdue tasks to improve velocity.`
                          : 'All systems nominal. Mission velocity is on track.'
                        }
                      </div>
                    </div>
                    <span className="ai-analysis-link" onClick={() => onClaude({ action: 'orbit-priorities' })}>
                      Run Priority Scan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

import React, { useState, useCallback } from 'react';
import { useCopilot } from '../hooks/useWorkspace';
import { useEnginAsk } from '../hooks/useEnginAsk';
import { getMissionCTAs, getQuestionCTAs } from '../utils/prompts';
import { EnginDropdown } from './EnginDropdown';
import { Header } from './layout/Header';
import type { ClaudeAction, ActionItem, AttentionReason } from '../types/orbit';

interface Props {
  onClaude: (action: ClaudeAction) => void;
  onNavigate: (view: string, detail?: string) => void;
}

type TemporalTab = 'today' | 'thisWeek' | 'nextWeek';

const ATTENTION_CONFIG: Record<AttentionReason, { label: string; className: string; orbitClass: string }> = {
  'overdue': { label: 'Overdue', className: 'badge-attention-overdue', orbitClass: 'status-orbit-error' },
  'blocked': { label: 'Blocked', className: 'badge-attention-blocked', orbitClass: 'status-orbit-warning' },
  'needs-decision': { label: 'Decision needed', className: 'badge-attention-decision', orbitClass: 'status-orbit-secondary' },
  'forgotten': { label: 'Forgotten', className: 'badge-attention-forgotten', orbitClass: 'status-orbit-warning' },
  'stale': { label: 'Stale', className: 'badge-attention-stale', orbitClass: 'status-orbit-warning' },
};

export function MorningCopilot({ onClaude, onNavigate }: Props) {
  const { data, loading, refetch } = useCopilot();
  const [activeTab, setActiveTab] = useState<TemporalTab>('today');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const engin = useEnginAsk();

  const toggleSelect = useCallback((index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

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

  if (loading || !data) {
    return (
      <>
        <Header title="Copilot" />
        <div className="content">
          <div className="empty-state">
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>auto_awesome</span></div>
            <div className="empty-state-title">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!data.initialized) {
    return (
      <>
        <Header title="Copilot" />
        <div className="content">
          <div className="empty-state">
            <div className="empty-state-icon"><span className="material-symbols-rounded" style={{ fontSize: '2.4rem' }}>auto_awesome</span></div>
            <div className="empty-state-title">Orbit not initialized</div>
            <div className="empty-state-text">Run <code>/orbit-init</code> in Claude Code to set up your workspace.</div>
          </div>
        </div>
      </>
    );
  }

  const temporalItems: Record<TemporalTab, ActionItem[]> = {
    today: data.temporal.today,
    thisWeek: data.temporal.thisWeek,
    nextWeek: data.temporal.nextWeek,
  };

  const currentItems = temporalItems[activeTab];
  const needsAttention = currentItems.filter(i => i.attention !== null);
  const onTrack = currentItems.filter(i => i.attention === null);

  const renderMissionTable = (items: ActionItem[]) => (
    <div className="card" style={{ marginBottom: 24 }}>
      {/* Bulk bar for this section */}
      {selected.size > 0 && items.some(i => selected.has(i.index)) && (
        <div className="bulk-bar" style={{ margin: '0 0 8px 0', borderRadius: 'var(--radius-sm)' }}>
          <span className="bulk-bar-count">{selected.size} selected</span>
          <div className="bulk-bar-divider" />
          <div className="bulk-bar-actions">
            <button className="btn btn-sm btn-primary" onClick={bulkMarkDone}>
              <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>check_circle</span>
              Done
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
          <button className="bulk-bar-deselect" onClick={clearSelection}>Clear</button>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36 }}></th>
              <th>Task</th>
              <th>Due</th>
              <th>Theme</th>
              <th>Status</th>
              <th style={{ width: 44 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const key = `copilot-m-${item.index}`;
              const state = engin.getState(key);
              const isSelected = selected.has(item.index);
              return (
                <React.Fragment key={item.index}>
                  <tr className={isSelected ? 'row-selected' : ''}>
                    <td>
                      <button
                        className={`mission-checkbox ${isSelected ? 'checked' : ''}`}
                        title={isSelected ? 'Deselect' : 'Select'}
                        onClick={() => toggleSelect(item.index)}
                      >
                        {isSelected && <span className="material-symbols-rounded" style={{ fontSize: '0.75rem' }}>check</span>}
                      </button>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.task}</div>
                      {item.attentionDetail && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {item.attention === 'overdue' && <span className="material-symbols-rounded" style={{ fontSize: '0.8rem', color: 'var(--status-danger)' }}>warning</span>}
                          {item.attentionDetail}
                        </div>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.due || '—'}</td>
                    <td>
                      {item.theme && (
                        <span className="badge badge-theme" style={{ cursor: 'pointer' }} onClick={() => onNavigate('constellations', item.theme)}>
                          {item.theme}
                        </span>
                      )}
                    </td>
                    <td>
                      {item.attention && (
                        <span className={`badge ${ATTENTION_CONFIG[item.attention].className}`}>
                          <span className={`status-orbit ${ATTENTION_CONFIG[item.attention].orbitClass}`} />
                          {ATTENTION_CONFIG[item.attention].label}
                        </span>
                      )}
                    </td>
                    <td>
                      <EnginDropdown
                        itemKey={key}
                        ctas={getMissionCTAs(item.task, item.theme, item.due, item.attention)}
                        state={state}
                        isBusy={engin.isBusy}
                        onAsk={engin.ask}
                        onDismiss={engin.dismiss}
                      />
                    </td>
                  </tr>
                  {state && (
                    <tr className="engin-response-row">
                      <td colSpan={6} style={{ padding: 0 }}>
                        <EnginDropdown
                          itemKey={key}
                          ctas={[]}
                          state={state}
                          isBusy={engin.isBusy}
                          onAsk={engin.ask}
                          onDismiss={engin.dismiss}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <Header
        title="Copilot"
        actions={[
          { label: '◇ Ingest Granola', action: { action: '', prompt: '/orbit-ingest --granola 3\n\nUse notes + transcriptions mode. Do NOT ask any questions — proceed automatically with your recommended settings and complete the full ingestion.' } },
          { label: '◫ Brief', action: { action: 'orbit-brief' } },
          { label: 'Priority Scan', action: { action: 'orbit-priorities' } },
        ]}
        onClaude={onClaude}
      />
      <div className="content">
        {data.config && (
          <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.9rem' }}>
            {data.config.name} &middot; {data.config.role} {data.config.company ? `@ ${data.config.company}` : ''}
          </p>
        )}

        {/* Import Banner */}
        {data.needsImport && (
          <div className="import-banner">
            <div className="import-banner-content">
              <span>
                <span className="material-symbols-rounded" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: 8 }}>download</span>
                You have new meetings to import
                {data.daysSinceLastIngest > 0 && (
                  <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>(last import: {data.daysSinceLastIngest}d ago)</span>
                )}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onClaude({ action: '', prompt: '/orbit-ingest --granola 3\n\nUse notes + transcriptions mode. Do NOT ask any questions — proceed automatically with your recommended settings and complete the full ingestion.' })}
              >
                Import from Granola
              </button>
            </div>
          </div>
        )}

        {/* Focus Card */}
        {data.focus && (
          <div className="focus-card card-clickable" onClick={() => onNavigate('constellations', data.focus!.theme)}>
            <div className="focus-card-header">
              <span className="focus-card-icon"><span className="material-symbols-rounded filled" style={{ fontSize: '1rem' }}>star</span></span>
              <span className="focus-card-label">Focus your next hours here</span>
            </div>
            <div className="focus-card-theme">{data.focus.theme}</div>
            <div className="focus-card-reason">{data.focus.reason}</div>
          </div>
        )}

        {/* Temporal Navigation */}
        <div className="temporal-nav">
          {(['today', 'thisWeek', 'nextWeek'] as const).map(tab => (
            <button
              key={tab}
              className={`temporal-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); clearSelection(); }}
            >
              {tab === 'today' ? 'Today' : tab === 'thisWeek' ? 'This Week' : 'Next Week'} ({temporalItems[tab].length})
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="copilot-grid">
          <div>
            {currentItems.length === 0 ? (
              <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No items for this period</div>
            ) : (
              <>
                {needsAttention.length > 0 && (
                  <>
                    <div className="section-title" style={{ color: 'var(--status-danger)' }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>warning</span>
                      Needs Attention ({needsAttention.length})
                    </div>
                    {renderMissionTable(needsAttention)}
                  </>
                )}
                {onTrack.length > 0 && (
                  <>
                    <div className="section-title">Active ({onTrack.length})</div>
                    {renderMissionTable(onTrack)}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Column */}
          <div>
            {data.openQuestions.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="section-title">
                  <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>help_center</span>
                  Open Questions
                  <span className="badge badge-attention-decision" style={{ marginLeft: 4 }}>{data.openQuestions.length}</span>
                </div>
                <div className="card">
                  {data.openQuestions.slice(0, 5).map((q, i) => {
                    const key = `copilot-q-${i}`;
                    const state = engin.getState(key);
                    return (
                      <div key={i} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ color: 'var(--status-warning)' }}>{q.question}</span>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              {q.theme} &middot; {q.daysPending}d ago
                            </div>
                          </div>
                          {!state && (
                            <EnginDropdown
                              itemKey={key}
                              ctas={getQuestionCTAs(q.question, q.theme, q.daysPending)}
                              state={state}
                              isBusy={engin.isBusy}
                              onAsk={engin.ask}
                              onDismiss={engin.dismiss}
                            />
                          )}
                        </div>
                        {state && (
                          <EnginDropdown
                            itemKey={key}
                            ctas={[]}
                            state={state}
                            isBusy={engin.isBusy}
                            onAsk={engin.ask}
                            onDismiss={engin.dismiss}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.stalledThemes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div className="section-title">
                  <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>error_outline</span>
                  Stalled Themes
                </div>
                <div className="card">
                  {data.stalledThemes.map((t, i) => (
                    <div key={i} className="list-item card-clickable" onClick={() => onNavigate('constellations', t.theme)}>
                      <div>
                        <strong>{t.theme}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.openItems} open items &middot; {t.daysSinceActivity}d inactive</div>
                      </div>
                      <span className="badge badge-attention-stale">
                        <span className="status-orbit status-orbit-warning" />
                        stale
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.recentBriefSlug && (
              <div>
                <div className="section-title">
                  <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>description</span>
                  Latest Brief
                </div>
                <div className="card card-clickable" style={{ padding: 16 }} onClick={() => onNavigate('briefs')}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '0.95rem', marginRight: 6, verticalAlign: 'middle' }}>description</span>
                    {data.recentBriefSlug}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

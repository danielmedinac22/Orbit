import { useState } from 'react';
import { useBriefs, useBrief } from '../hooks/useWorkspace';
import { Header } from './layout/Header';
import type { ClaudeAction } from '../types/orbit';

const TYPE_LABELS: Record<string, string> = {
  daily: '◫ Daily',
  weekly: '◫ Weekly',
  prep: '◫ Prep',
};

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
          <a className="back-link" onClick={() => setSelected(null)}>← Back to Briefs</a>
          <div className="card">
            <div className="md-content" dangerouslySetInnerHTML={{ __html: detail.content }} />
          </div>
        </div>
      </>
    );
  }

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
            <div className="empty-state-icon">◫</div>
            <div className="empty-state-title">No briefs generated</div>
            <div className="empty-state-text">Click "Daily Brief" above or run <code>/orbit-brief</code> in Claude Code.</div>
          </div>
        ) : (
          <div className="card">
            {briefs.map(b => (
              <div key={b.slug} className="list-item" onClick={() => setSelected(b.slug)}>
                <div>
                  <strong>{b.slug}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 12, fontSize: '0.85rem' }}>
                    {TYPE_LABELS[b.type] || b.type}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

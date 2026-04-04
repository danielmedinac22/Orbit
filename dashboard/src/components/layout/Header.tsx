import type { ClaudeAction } from '../../types/orbit';

interface HeaderProps {
  title: string;
  actions?: Array<{ label: string; action: ClaudeAction }>;
  onClaude?: (action: ClaudeAction) => void;
}

export function Header({ title, actions, onClaude }: HeaderProps) {
  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      {actions && actions.length > 0 && (
        <div className="header-actions">
          {actions.map((a, i) => (
            <button key={i} className="btn" onClick={() => onClaude?.(a.action)}>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

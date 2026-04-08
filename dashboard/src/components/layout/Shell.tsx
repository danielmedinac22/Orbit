import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface ShellProps {
  activeView: string;
  onNavigate: (view: string) => void;
  claudeRunning?: boolean;
  claudeHasOutput?: boolean;
  onClaudeClick?: () => void;
  children: ReactNode;
}

export function Shell({ activeView, onNavigate, claudeRunning, claudeHasOutput, onClaudeClick, children }: ShellProps) {
  return (
    <div className="shell">
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        claudeRunning={claudeRunning}
        claudeHasOutput={claudeHasOutput}
        onClaudeClick={onClaudeClick}
      />
      <div className="main">
        {children}
      </div>
    </div>
  );
}

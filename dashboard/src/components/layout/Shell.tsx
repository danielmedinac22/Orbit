import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface ShellProps {
  activeView: string;
  onNavigate: (view: string) => void;
  children: ReactNode;
}

export function Shell({ activeView, onNavigate, children }: ShellProps) {
  return (
    <div className="shell">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <div className="main">
        {children}
      </div>
    </div>
  );
}

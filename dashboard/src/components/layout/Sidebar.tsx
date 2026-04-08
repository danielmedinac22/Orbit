interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  claudeRunning?: boolean;
  claudeHasOutput?: boolean;
  onClaudeClick?: () => void;
}

const NAV_ITEMS = [
  { id: 'copilot', icon: 'auto_awesome', iconFilled: 'auto_awesome', label: 'Copilot' },
  { id: 'constellations', icon: 'star', iconFilled: 'star', label: 'Constellations' },
  { id: 'missions', icon: 'diamond', iconFilled: 'diamond', label: 'Missions' },
  { id: 'signals', icon: 'sensors', iconFilled: 'sensors', label: 'Signals' },
];

const FOOTER_ITEMS = [
  { id: 'briefs', icon: 'description', iconFilled: 'description', label: 'Briefs' },
];

export function Sidebar({ activeView, onNavigate, claudeRunning, claudeHasOutput, onClaudeClick }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span className="material-symbols-rounded filled" style={{ fontSize: '1.2rem' }}>circle</span>
        Orbit
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">
              <span className={`material-symbols-rounded ${activeView === item.id ? 'filled' : ''}`}>
                {activeView === item.id ? item.iconFilled : item.icon}
              </span>
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        {FOOTER_ITEMS.map(item => (
          <div
            key={item.id}
            className={`sidebar-item sidebar-item-secondary ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">
              <span className={`material-symbols-rounded ${activeView === item.id ? 'filled' : ''}`}>
                {activeView === item.id ? item.iconFilled : item.icon}
              </span>
            </span>
            <span>{item.label}</span>
          </div>
        ))}
        {(claudeRunning || claudeHasOutput) && (
          <div
            className={`sidebar-item sidebar-claude-indicator ${claudeRunning ? 'running' : ''}`}
            onClick={onClaudeClick}
          >
            <span className="sidebar-icon">
              {claudeRunning ? <span className="claude-dot-pulse" /> : <span className="material-symbols-rounded" style={{ fontSize: '0.9rem' }}>circle</span>}
            </span>
            <span>{claudeRunning ? 'Engin running...' : 'Last result'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

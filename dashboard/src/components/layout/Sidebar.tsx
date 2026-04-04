interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const NAV_ITEMS = [
  { id: 'station', icon: '◉', label: 'Station' },
  { id: 'signals', icon: '◇', label: 'Signals' },
  { id: 'constellations', icon: '★', label: 'Constellations' },
  { id: 'missions', icon: '◈', label: 'Missions' },
  { id: 'coordinates', icon: '⊕', label: 'Coordinates' },
  { id: 'briefs', icon: '◫', label: 'Briefs' },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">◉ Orbit</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

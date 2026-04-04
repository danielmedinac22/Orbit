import { useState, useCallback } from 'react';
import { Shell } from './components/layout/Shell';
import { StationOverview } from './components/StationOverview';
import { SignalList } from './components/SignalList';
import { ConstellationList } from './components/ConstellationList';
import { MissionBoard } from './components/MissionBoard';
import { CoordinateLog } from './components/CoordinateLog';
import { BriefView } from './components/BriefView';
import { ClaudePanel } from './components/ClaudePanel';
import { useWebSocket } from './hooks/useWebSocket';
import { useClaude } from './hooks/useClaude';
import type { ClaudeAction } from './types/orbit';

export default function App() {
  const [view, setView] = useState('station');
  const [detail, setDetail] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const claude = useClaude();

  const handleNavigate = useCallback((newView: string, newDetail?: string) => {
    setView(newView);
    setDetail(newDetail);
  }, []);

  const handleClaude = useCallback((action: ClaudeAction) => {
    claude.run(action);
  }, [claude]);

  const handleWSMessage = useCallback((msg: { type: string; [key: string]: unknown }) => {
    if (msg.type === 'file-change') {
      setRefreshKey(k => k + 1);
    }
    if (msg.type === 'output' || msg.type === 'status' || msg.type === 'error' || msg.type === 'done') {
      claude.handleWSMessage(msg as { type: string; content: string });
    }
  }, [claude]);

  useWebSocket(handleWSMessage);

  const renderView = () => {
    switch (view) {
      case 'station':
        return <StationOverview key={refreshKey} onClaude={handleClaude} onNavigate={handleNavigate} />;
      case 'signals':
        return <SignalList key={refreshKey} onClaude={handleClaude} initialSlug={detail} />;
      case 'constellations':
        return <ConstellationList key={refreshKey} onClaude={handleClaude} onNavigate={handleNavigate} initialDetail={detail} />;
      case 'missions':
        return <MissionBoard key={refreshKey} onClaude={handleClaude} />;
      case 'coordinates':
        return <CoordinateLog key={refreshKey} onClaude={handleClaude} />;
      case 'briefs':
        return <BriefView key={refreshKey} onClaude={handleClaude} />;
      default:
        return <StationOverview key={refreshKey} onClaude={handleClaude} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Shell activeView={view} onNavigate={(v) => handleNavigate(v)}>
      {renderView()}
      <ClaudePanel
        isOpen={claude.isOpen}
        isRunning={claude.isRunning}
        output={claude.output}
        status={claude.status}
        onClose={claude.close}
        onStop={claude.stop}
      />
    </Shell>
  );
}

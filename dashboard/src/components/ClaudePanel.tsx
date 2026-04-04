interface ClaudePanelProps {
  isOpen: boolean;
  isRunning: boolean;
  output: string;
  status: string;
  onClose: () => void;
  onStop: () => void;
}

export function ClaudePanel({ isOpen, isRunning, output, status, onClose, onStop }: ClaudePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="claude-panel-overlay" onClick={onClose} />
      <div className="claude-panel">
        <div className="claude-panel-header">
          <span className="claude-panel-title">◉ Engin</span>
          <button className="claude-panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="claude-panel-body">
          {output || 'Waiting for output...'}
        </div>
        <div className="claude-panel-status">
          {isRunning && <div className="claude-spinner" />}
          <span>{status}</span>
          {isRunning && (
            <button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={onStop}>
              Stop
            </button>
          )}
        </div>
      </div>
    </>
  );
}

import { useRef, useEffect, useMemo } from 'react';

interface ClaudePanelProps {
  isOpen: boolean;
  isRunning: boolean;
  output: string;
  status: string;
  onClose: () => void;
  onStop: () => void;
}

interface LogEntry {
  timestamp: string;
  label: string;
  labelClass: string;
  message: string;
}

function parseOutputToLog(output: string, isRunning: boolean): LogEntry[] {
  if (!output) return [];

  const lines = output.split('\n').filter(l => l.trim());
  const now = new Date();

  return lines.map((line, idx) => {
    const seconds = now.getSeconds() - (lines.length - idx) * 3;
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(Math.abs(seconds) % 60).padStart(2, '0')}`;

    // Detect log type from content
    let label = 'EXEC';
    let labelClass = 'log-label-exec';

    const lower = line.toLowerCase();
    if (idx === 0) {
      label = 'INIT';
      labelClass = 'log-label-init';
    } else if (lower.includes('warn') || lower.includes('error') || lower.includes('fail') || lower.includes('risk') || lower.includes('block')) {
      label = 'WARN';
      labelClass = 'log-label-warn';
    } else if (lower.includes('scan') || lower.includes('search') || lower.includes('read') || lower.includes('analyz')) {
      label = 'SCAN';
      labelClass = 'log-label-scan';
    } else if (lower.includes('sync') || lower.includes('save') || lower.includes('write') || lower.includes('update')) {
      label = 'SYNC';
      labelClass = 'log-label-sync';
    } else if (lower.includes('wait') || lower.includes('idle') || lower.includes('pause')) {
      label = 'IDLE';
      labelClass = 'log-label-idle';
    }

    return { timestamp: ts, label, labelClass, message: line };
  });
}

export function ClaudePanel({ isOpen, isRunning, output, status, onClose, onStop }: ClaudePanelProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const logEntries = useMemo(() => parseOutputToLog(output, isRunning), [output, isRunning]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [output]);

  if (!isOpen) return null;

  return (
    <>
      <div className="claude-panel-overlay" onClick={onClose} />
      <div className="claude-panel">
        <div className="claude-panel-header">
          <span className="claude-panel-title">
            <span className="status-dot" style={isRunning ? { animation: 'dot-pulse 1.4s ease-in-out infinite' } : {}} />
            Engin
          </span>
          <button className="claude-panel-close" onClick={onClose}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>close</span>
          </button>
        </div>
        <div className="claude-panel-body" ref={bodyRef}>
          {logEntries.length === 0 ? (
            <span style={{ color: 'var(--text-dim)' }}>Waiting for output...</span>
          ) : (
            logEntries.map((entry, idx) => (
              <div key={idx} className="log-entry">
                <span className="log-timestamp">{entry.timestamp}</span>
                <span className={`log-label ${entry.labelClass}`}>{entry.label}</span>
                <span className="log-message">
                  {entry.message}
                  {idx === logEntries.length - 1 && isRunning && <span className="log-cursor" />}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="claude-panel-status">
          {isRunning ? (
            <>
              <span className="status-dot" style={{ animation: 'dot-pulse 1.4s ease-in-out infinite' }} />
              <span style={{ color: 'var(--primary)' }}>Engin running...</span>
              <button
                className="btn btn-sm"
                style={{ marginLeft: 'auto', borderColor: 'var(--outline-variant)' }}
                onClick={onStop}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)';
                  e.currentTarget.style.color = 'var(--status-danger)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--outline-variant)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '0.85rem' }}>stop</span>
                Stop
              </button>
            </>
          ) : (
            <span>{status || 'Ready'}</span>
          )}
        </div>
      </div>
    </>
  );
}

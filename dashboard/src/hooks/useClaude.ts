import { useState, useCallback } from 'react';
import type { ClaudeAction } from '../types/orbit';

export function useClaude() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');

  const run = useCallback(async (action: ClaudeAction) => {
    setIsOpen(true);
    setIsRunning(true);
    setOutput('');
    setStatus(`Starting: /${action.action} ${action.args || ''}`);

    try {
      const res = await fetch('/api/claude/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      if (!res.ok) {
        const err = await res.json();
        setOutput(err.error || 'Failed to start');
        setIsRunning(false);
        return;
      }

      setStatus('Running...');
    } catch (err) {
      setOutput(`Connection error: ${err}`);
      setIsRunning(false);
    }
  }, []);

  const handleWSMessage = useCallback((msg: { type: string; content: string }) => {
    if (msg.type === 'output') {
      setOutput(prev => prev + msg.content);
    } else if (msg.type === 'status') {
      setStatus(msg.content);
    } else if (msg.type === 'error') {
      setOutput(prev => prev + `\nError: ${msg.content}`);
    } else if (msg.type === 'done') {
      setIsRunning(false);
      setStatus(msg.content);
    }
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOutput('');
    setStatus('');
  }, []);

  const stop = useCallback(async () => {
    try {
      await fetch('/api/claude/stop', { method: 'POST' });
    } catch {}
  }, []);

  return { isOpen, isRunning, output, status, run, close, stop, handleWSMessage };
}

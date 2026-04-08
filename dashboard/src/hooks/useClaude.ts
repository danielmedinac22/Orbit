import { useState, useCallback } from 'react';
import type { ClaudeAction } from '../types/orbit';

export function useClaude() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('');

  const run = useCallback(async (action: ClaudeAction) => {
    // If already running, just reopen the panel — don't clear anything
    if (isRunning) {
      setIsOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/claude/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      if (!res.ok) {
        const err = await res.json();
        // If busy, just reopen the panel with existing output
        if (res.status === 409) {
          setIsOpen(true);
          return;
        }
        setIsOpen(true);
        setOutput(err.error || 'Failed to start');
        setIsRunning(false);
        return;
      }

      // Only clear and start fresh on successful launch
      setIsOpen(true);
      setIsRunning(true);
      setOutput('');
      setStatus(`Running: /${action.action} ${action.args || ''}`);
    } catch (err) {
      setIsOpen(true);
      setOutput(`Connection error: ${err}`);
      setIsRunning(false);
    }
  }, [isRunning]);

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
  }, []);

  const reopen = useCallback(() => {
    if (output || isRunning) {
      setIsOpen(true);
    }
  }, [output, isRunning]);

  const stop = useCallback(async () => {
    try {
      await fetch('/api/claude/stop', { method: 'POST' });
    } catch {}
  }, []);

  return { isOpen, isRunning, output, status, run, close, reopen, stop, handleWSMessage };
}

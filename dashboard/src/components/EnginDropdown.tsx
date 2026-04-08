import { useState, useRef, useEffect, useCallback } from 'react';
import type { EnginCTA } from '../utils/prompts';
import type { EnginAskState } from '../types/orbit';

interface Props {
  itemKey: string;
  ctas: EnginCTA[];
  state: EnginAskState | undefined;
  isBusy: boolean;
  onAsk: (itemKey: string, prompt: string) => void;
  onDismiss: (itemKey: string) => void;
}

export function EnginDropdown({ itemKey, ctas, state, isBusy, onAsk, onDismiss }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.right - 200 });
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // If showing response (no CTAs needed), render inline response
  if (state) {
    return (
      <div className="engin-inline-response">
        {state.loading ? (
          <div className="engin-inline-loading">
            <div className="claude-spinner" /> Thinking...
          </div>
        ) : state.error ? (
          <div className="engin-inline-error">
            {state.error}
            <button className="engin-dismiss" onClick={() => onDismiss(itemKey)}>✕</button>
          </div>
        ) : (
          <div className="engin-inline-text">
            <span>{state.response}</span>
            <button className="engin-dismiss" onClick={() => onDismiss(itemKey)}>✕</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="engin-dropdown-wrap">
      <button
        ref={btnRef}
        className="btn-ask-engin"
        title="Ask Engin"
        disabled={isBusy}
        onClick={openMenu}
      >
        ?
      </button>
      {open && (
        <div
          ref={menuRef}
          className="engin-dropdown"
          style={{ top: pos.top, left: pos.left }}
        >
          {ctas.map((cta, i) => (
            <button
              key={i}
              className="engin-dropdown-item"
              onClick={() => {
                setOpen(false);
                onAsk(itemKey, cta.prompt);
              }}
            >
              {cta.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

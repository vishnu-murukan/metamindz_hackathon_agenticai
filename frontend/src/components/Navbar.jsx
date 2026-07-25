import React from 'react';
import { Cpu, Activity, Server, Zap, RefreshCw, Play, Pause } from 'lucide-react';

export default function Navbar({
  isLive,
  isPaused,
  onTogglePlay,
  onRestart,
  onOpenBackendModal,
  useRealBackend,
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 24px', marginBottom: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>METAMINDZ</h1>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>AGY Decision Twin</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ScenarioSimulationAgent & Multi-Agent Live Negotiation Engine</p>
          </div>
        </div>

        {/* Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)' }}>
            <div className="live-dot" style={{ backgroundColor: isLive ? '#10b981' : '#f59e0b', boxShadow: isLive ? '0 0 10px #10b981' : '0 0 10px #f59e0b' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {isLive ? 'Negotiation In Progress' : 'Simulation Complete'}
            </span>
          </div>

          <button
            onClick={onTogglePlay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: isPaused ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
              border: `1px solid ${isPaused ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
              color: isPaused ? '#34d399' : '#38bdf8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            onClick={onRestart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
            Restart
          </button>

          <button
            onClick={onOpenBackendModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: useRealBackend ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${useRealBackend ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-glass)'}`,
              color: useRealBackend ? '#c084fc' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Server size={16} />
            {useRealBackend ? 'Backend: Live API' : 'Backend: Mock Engine'}
          </button>

        </div>

      </div>
    </header>
  );
}

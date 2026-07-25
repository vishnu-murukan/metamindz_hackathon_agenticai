import React from 'react';
import { X, Server, Code, CheckCircle, Zap, RefreshCw } from 'lucide-react';

export default function BackendAdapterModal({ isOpen, onClose, useRealBackend, onToggleBackend }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-glow)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>Pluggable Backend Adapter</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
          The MetaMindz Decision Twin architecture is powered by a native <b>NitroStack TypeScript MCP Server</b> and decoupled <b>SimulationService</b> adapter layer. You can seamlessly toggle between client-side simulation and live MCP / REST server calls.
        </p>

        {/* Mode Toggle */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Active Data Mode</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {useRealBackend ? 'Connected to NitroStack TypeScript MCP Server (http://localhost:3000)' : 'Client-Side Rule Engine & Stream'}
            </div>
          </div>
          <button
            onClick={onToggleBackend}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: useRealBackend ? 'rgba(168, 85, 247, 0.3)' : 'rgba(56, 189, 248, 0.3)',
              border: `1px solid ${useRealBackend ? '#c084fc' : '#38bdf8'}`,
              color: useRealBackend ? '#c084fc' : '#38bdf8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {useRealBackend ? 'Switch to Client Data' : 'Switch to TypeScript Backend API'}
          </button>
        </div>

        {/* Code Contract Example */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Code size={14} /> NitroStack TypeScript MCP Tool Contract:
          </div>
          <pre style={{
            background: '#040711',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-code)',
            overflowX: 'auto',
          }}>
{`POST /mcp/tools/simulate_scenarios
Content-Type: application/json

{
  "vibrationLevel": 6.5,
  "temperature": 85.0,
  "hourlyDowntimeCost": 12500,
  "activeOrders": 3,
  "delayDays": 7,
  "capacityPct": 60
}`}
          </pre>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { AGENT_PROFILES } from '../services/NegotiationService';
import { MessageSquare, Filter, ChevronRight, CheckCircle, AlertOctagon, Calculator, ShieldAlert, Cpu } from 'lucide-react';

export default function NegotiationTranscript({ messages, isLive, isPaused }) {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('ALL');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = selectedAgentFilter === 'ALL'
    ? messages
    : messages.filter(m => m.agentKey === selectedAgentFilter);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '640px' }}>
      
      {/* Header & Agent Filter */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Live Agent Negotiation Stream</h3>
          <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{messages.length} Messages</span>
        </div>

        {/* Agent Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Agents</option>
            {Object.keys(AGENT_PROFILES).map((key) => (
              <option key={key} value={key}>{AGENT_PROFILES[key].name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Cpu size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem' }}>Initializing Multi-Agent Negotiation Stream...</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const agent = AGENT_PROFILES[msg.agentKey] || AGENT_PROFILES.SensorAgent;
            const isSimulation = msg.isSimulationOutput;
            const isVeto = msg.details?.sopViolation && msg.details.sopViolation !== 'None';
            const isDecision = msg.agentKey === 'PlantManager';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '14px',
                  background: isSimulation
                    ? 'rgba(56, 189, 248, 0.06)'
                    : isVeto
                    ? 'rgba(244, 63, 94, 0.08)'
                    : isDecision
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(30, 41, 59, 0.4)',
                  border: isSimulation
                    ? '1px solid rgba(56, 189, 248, 0.3)'
                    : isVeto
                    ? '1px solid rgba(244, 63, 94, 0.3)'
                    : isDecision
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid var(--border-glass)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Agent Avatar Icon */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}>
                  {agent.avatar}
                </div>

                {/* Message Body */}
                <div style={{ flex: 1 }}>
                  
                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{agent.name}</span>
                      <span className={`badge badge-${agent.color}`} style={{ fontSize: '0.65rem' }}>{agent.role}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>• {msg.phase}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-code)' }}>{msg.timestamp}</span>
                  </div>

                  {/* Message Content */}
                  <div style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line',
                  }}>
                    {msg.message}
                  </div>

                  {/* Structured Details Box */}
                  {msg.details && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-code)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      {Object.entries(msg.details).map(([key, value]) => {
                        if (typeof value === 'object') return null;
                        return (
                          <div key={key} style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{key}:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}

        {/* Live Typing Status */}
        {isLive && !isPaused && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ display: 'inline-flex', gap: '4px' }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <span>Agent thinking & computing next proposal...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

    </div>
  );
}

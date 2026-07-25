import React from 'react';
import { Sliders, Wrench, Shield, AlertTriangle, ArrowRight, Zap, CheckCircle2, DollarSign, Clock } from 'lucide-react';

export default function ScenarioMatrix({ params, onChangeParam, simResults }) {
  if (!simResults || !simResults.strategies) return null;

  const { strategies, bestStrategyId } = simResults;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Parameter Tuning Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sliders size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Scenario Simulation Parameters</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          {/* Slider 1: Vibration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Vibration Level (0-10)</span>
              <span style={{ color: params.vibrationLevel > 7 ? '#fb7185' : '#38bdf8', fontWeight: 700 }}>
                {params.vibrationLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.1"
              value={params.vibrationLevel}
              onChange={(e) => onChangeParam('vibrationLevel', parseFloat(e.target.value))}
            />
          </div>

          {/* Slider 2: Delay Days */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Days to Delay Repair</span>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                {params.delayDays} Days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={params.delayDays}
              onChange={(e) => onChangeParam('delayDays', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Slider 3: Hourly Cost */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Hourly Downtime Cost</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>
                ${params.hourlyDowntimeCost.toLocaleString()}/hr
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="30000"
              step="500"
              value={params.hourlyDowntimeCost}
              onChange={(e) => onChangeParam('hourlyDowntimeCost', parseInt(e.target.value, 10))}
            />
          </div>

          {/* Slider 4: Capacity De-rate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <span>Reduced Capacity %</span>
              <span style={{ color: '#c084fc', fontWeight: 700 }}>
                {params.capacityPct}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={params.capacityPct}
              onChange={(e) => onChangeParam('capacityPct', parseInt(e.target.value, 10))}
            />
          </div>

        </div>
      </div>

      {/* 2. Strategy Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {Object.values(strategies).map((strat) => {
          const isBest = strat.id === bestStrategyId;
          const isVetoed = params.vibrationLevel > 7.0 && strat.id === 'delay_repair';

          return (
            <div
              key={strat.id}
              className={`glass-panel ${isBest ? 'glass-panel-hover' : ''}`}
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: isBest
                  ? '2px solid #10b981'
                  : isVetoed
                  ? '1px solid rgba(244, 63, 94, 0.4)'
                  : '1px solid var(--border-glass)',
                background: isBest
                  ? 'rgba(16, 185, 129, 0.04)'
                  : isVetoed
                  ? 'rgba(244, 63, 94, 0.04)'
                  : 'var(--bg-card)',
                position: 'relative',
              }}
            >
              {/* Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className={`badge badge-${strat.badgeColor}`}>{strat.badge}</span>
                {isBest && (
                  <span className="badge badge-emerald" style={{ boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}>
                    ★ #1 Recommended
                  </span>
                )}
                {isVetoed && (
                  <span className="badge badge-rose">SOP Vetoed</span>
                )}
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                {strat.name}
              </h4>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expected Cost</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    ${strat.totalExpectedCost.toLocaleString()}
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.6)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Failure Risk</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: strat.failureRiskPct > 30 ? '#fb7185' : '#34d399' }}>
                    {strat.failureRiskPct}%
                  </div>
                </div>

              </div>

              {/* Progress Bars for Risk & Cost Comparison */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    <span>Failure Risk Bar</span>
                    <span>{strat.failureRiskPct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, strat.failureRiskPct)}%`,
                        height: '100%',
                        background: strat.failureRiskPct > 40 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #10b981, #38bdf8)',
                        borderRadius: '3px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pros & Cons */}
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {strat.pros.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                    <CheckCircle2 size={12} /> {p}
                  </div>
                ))}
                {strat.cons.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185' }}>
                    <AlertTriangle size={12} /> {c}
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

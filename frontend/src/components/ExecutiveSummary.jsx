import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function ExecutiveSummary({ simResults, vibrationLevel }) {
  if (!simResults || !simResults.strategies) return null;

  const bestStrat = simResults.strategies[simResults.bestStrategyId];
  const delayStrat = simResults.strategies.delay_repair;
  const isHighRiskVibration = vibrationLevel > 7.0;

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
        
        {/* Main Recommendation Banner */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">Consensus Decision Reached</span>
            {isHighRiskVibration && <span className="badge badge-rose">SOP Veto Active (Vibration &gt; 7.0)</span>}
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Top Strategy: <span className="text-gradient">{bestStrat.name}</span>
          </h2>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            The <b>ScenarioSimulationAgent</b> evaluated counterfactual trade-offs across 3 strategies. Executing <b>{bestStrat.name}</b> avoids catastrophic bearing seizure and yields maximum operational resilience.
          </p>
        </div>

        {/* Metric Card 1: Net Savings */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            <TrendingUp size={16} /> Net Cost Savings vs Delay
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            ${simResults.costSavingsVsDelay.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Prevents expected catastrophic loss of ${delayStrat.totalExpectedCost.toLocaleString()}
          </div>
        </div>

        {/* Metric Card 2: Expected Total Cost */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            <DollarSign size={16} /> Total Expected Cost
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            ${bestStrat.totalExpectedCost.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Repair (${bestStrat.repairCost.toLocaleString()}) + Downtime (${bestStrat.downtimeLoss.toLocaleString()})
          </div>
        </div>

        {/* Metric Card 3: Downtime & Risk */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
            <Clock size={16} /> Downtime & Failure Risk
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            {bestStrat.downtimeHours} hrs <span style={{ fontSize: '1rem', color: '#34d399', fontWeight: 600 }}>({bestStrat.failureRiskPct}% Risk)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Resilience Score: {bestStrat.resilienceScore}/100
          </div>
        </div>

      </div>
    </div>
  );
}

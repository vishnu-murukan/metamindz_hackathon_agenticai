/**
 * NegotiationService.js
 * Multi-Agent Live Negotiation Engine & Backend Adapter.
 * Streams real-time messages between SensorAgent, MaintenanceAgent, FinanceAgent,
 * ScenarioSimulationAgent, SafetyAgent, and PlantManager.
 */

import { runSimulation } from './SimulationService';

// Standardized Agent Profiles
export const AGENT_PROFILES = {
  SensorAgent: { name: 'Sensor Agent', role: 'Evidence Layer', color: 'cyan', avatar: '📡' },
  MaintenanceAgent: { name: 'Maintenance Agent', role: 'Asset Health', color: 'amber', avatar: '🔧' },
  MemoryAgent: { name: 'Memory / Precedent Agent', role: 'RAG Memory', color: 'purple', avatar: '🧠' },
  FinanceAgent: { name: 'Finance Agent', role: 'Financial Impact', color: 'emerald', avatar: '💰' },
  ScenarioSimulationAgent: { name: 'Scenario Simulation Agent', role: 'Numeric Engine', color: 'primary', avatar: '📊' },
  SafetyAgent: { name: 'Safety & SOP Agent', role: 'Compliance Veto', color: 'rose', avatar: '🛡️' },
  PlantManager: { name: 'Plant Manager (Coordinator)', role: 'Executive Lead', color: 'gold', avatar: '👔' },
};

/**
 * Generate transcript step sequence dynamically based on current numeric simulation parameters
 */
export function generateTranscriptSteps(params) {
  const simResults = runSimulation(params);
  const { vibrationLevel, temperature, hourlyDowntimeCost, delayDays } = params;
  const bestStrat = simResults.strategies[simResults.bestStrategyId];

  return [
    {
      id: 1,
      agentKey: 'SensorAgent',
      timestamp: '18:20:01',
      phase: 'Evidence Gathering',
      message: `ALERT: Spindle Bearing #4 telemetry anomaly detected on CNC Unit 12. Vibration level: ${vibrationLevel}/10 (Threshold: 5.0), Temp: ${temperature}°C (Threshold: 80°C).`,
      details: { vibration: vibrationLevel, temperature, severity: vibrationLevel > 7 ? 'HIGH/CRITICAL' : 'MODERATE' },
      delayMs: 800,
    },
    {
      id: 2,
      agentKey: 'MaintenanceAgent',
      timestamp: '18:20:03',
      phase: 'Evidence Gathering',
      message: `Machine Health Index evaluated at ${(Math.max(0.2, 1 - (vibrationLevel / 10))).toFixed(2) * 100}%. P(failure) within 7 days estimated at ${simResults.strategies.delay_repair.failureRiskPct}%. Recommended action: Immediate inspection and repair.`,
      details: { healthScore: `${(Math.max(0.2, 1 - (vibrationLevel / 10)) * 100).toFixed(0)}%`, failureProb: `${simResults.strategies.delay_repair.failureRiskPct}%` },
      delayMs: 1200,
    },
    {
      id: 3,
      agentKey: 'MemoryAgent',
      timestamp: '18:20:05',
      phase: 'Precedent Lookup',
      message: `Found 1 historical match (INC-2024-0847, 91% similarity). Case study: Delaying repair by 5 days led to total bearing seizure, causing 48 hours downtime ($600k loss). Immediate repair averted catastrophic loss.`,
      details: { precedentId: 'INC-2024-0847', matchScore: '91%' },
      delayMs: 1100,
    },
    {
      id: 4,
      agentKey: 'FinanceAgent',
      timestamp: '18:20:08',
      phase: 'Financial Evaluation',
      message: `At $${hourlyDowntimeCost.toLocaleString()}/hr downtime cost: Immediate Repair cost is $${simResults.strategies.repair_now.totalExpectedCost.toLocaleString()} (4h stop). Delaying repair carries an expected risk cost of $${simResults.strategies.delay_repair.totalExpectedCost.toLocaleString()} (${simResults.strategies.delay_repair.failureRiskPct}% risk of 48h outage).`,
      details: { repairNowCost: `$${simResults.strategies.repair_now.totalExpectedCost.toLocaleString()}`, expectedDelayCost: `$${simResults.strategies.delay_repair.totalExpectedCost.toLocaleString()}` },
      delayMs: 1400,
    },
    {
      id: 5,
      agentKey: 'ScenarioSimulationAgent',
      timestamp: '18:20:12',
      phase: 'Scenario Simulation',
      message: `NUMERIC SIMULATION COMPLETE: Evaluated 3 strategies:\n1. Repair Now: Cost $${simResults.strategies.repair_now.totalExpectedCost.toLocaleString()} | Risk 2.0% | Score 92/100\n2. Reduced Capacity (60%): Cost $${simResults.strategies.reduced_capacity.totalExpectedCost.toLocaleString()} | Risk ${simResults.strategies.reduced_capacity.failureRiskPct}% | Score 85/100\n3. Delay Repair (${delayDays}d): Cost $${simResults.strategies.delay_repair.totalExpectedCost.toLocaleString()} | Risk ${simResults.strategies.delay_repair.failureRiskPct}% | Score ${simResults.strategies.delay_repair.resilienceScore}/100.\n\nRecommendation: ${bestStrat.name} saves $${simResults.costSavingsVsDelay.toLocaleString()} vs delaying repair.`,
      details: simResults,
      isSimulationOutput: true,
      delayMs: 1600,
    },
    {
      id: 6,
      agentKey: 'SafetyAgent',
      timestamp: '18:20:15',
      phase: 'Compliance Check',
      message: vibrationLevel > 7.0
        ? `SOP VETO ISSUED: Violation of SOP-MFG-042 (Vibration > 7.0/10). Unrestricted delay_repair is VETOED for safety compliance. Viable options: [immediate_repair, reduced_capacity].`
        : `Compliance Check Passed. No SOP vetoes triggered. All 3 options remain viable.`,
      details: { sopViolation: vibrationLevel > 7.0 ? 'SOP-MFG-042' : 'None', vetoedAction: vibrationLevel > 7.0 ? 'delay_repair' : 'None' },
      delayMs: 1200,
    },
    {
      id: 7,
      agentKey: 'PlantManager',
      timestamp: '18:20:18',
      phase: 'Consensus Decision',
      message: `EXECUTIVE DECISION REPO: Consensus reached on "${bestStrat.name}". Dispatching Maintenance Team B immediately with SKUs SBA-4420. Estimated recovery to 100% capacity in 4 hours. Net savings realized: $${simResults.costSavingsVsDelay.toLocaleString()}.`,
      details: { finalDecision: bestStrat.name, savings: `$${simResults.costSavingsVsDelay.toLocaleString()}`, status: 'APPROVED' },
      delayMs: 1500,
    },
  ];
}

/**
 * Live Negotiation Controller
 */
export class NegotiationController {
  constructor(params, onMessageCallback, onCompleteCallback) {
    this.params = params;
    this.onMessage = onMessageCallback;
    this.onComplete = onCompleteCallback;
    this.steps = generateTranscriptSteps(params);
    this.currentIndex = 0;
    this.isPaused = false;
    this.timer = null;
  }

  start() {
    this.isPaused = false;
    this.scheduleNext();
  }

  pause() {
    this.isPaused = true;
    if (this.timer) clearTimeout(this.timer);
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.scheduleNext();
    }
  }

  restart(newParams) {
    this.pause();
    if (newParams) this.params = newParams;
    this.steps = generateTranscriptSteps(this.params);
    this.currentIndex = 0;
    this.start();
  }

  scheduleNext() {
    if (this.isPaused || this.currentIndex >= this.steps.length) {
      if (this.currentIndex >= this.steps.length && this.onComplete) {
        this.onComplete();
      }
      return;
    }

    const currentStep = this.steps[this.currentIndex];
    this.timer = setTimeout(() => {
      if (!this.isPaused) {
        this.onMessage(currentStep);
        this.currentIndex++;
        this.scheduleNext();
      }
    }, currentStep.delayMs || 1000);
  }
}

/**
 * SimulationService.js
 * JavaScript numeric evaluation engine for ScenarioSimulationAgent.
 * Evaluates Repair Now, Delay Repair, and Reduced Capacity strategies.
 */

export function runSimulation({
  vibrationLevel = 6.5,
  temperature = 85.0,
  hourlyDowntimeCost = 12500,
  activeOrders = 3,
  delayDays = 7,
  capacityPct = 60,
}) {
  const severityFactor = Math.max(1.0, (vibrationLevel / 5.0) * (temperature / 80.0));

  // --- 1. REPAIR NOW ---
  const rnDowntimeHrs = 4.0;
  const rnRepairCost = 45000;
  const rnDowntimeLoss = rnDowntimeHrs * hourlyDowntimeCost;
  const rnTotalCost = rnRepairCost + rnDowntimeLoss;
  const rnFailureRisk = 2.0;
  const rnDeliveryRisk = 5.0;
  const rnScore = severityFactor > 1.2 ? 92 : 80;

  // --- 2. DELAY REPAIR ---
  const baseDailyRisk = Math.min(0.25, 0.05 * severityFactor);
  const drFailureProb = Math.min(0.95, 1.0 - Math.exp(-baseDailyRisk * delayDays));
  const drCatastrophicDowntimeHrs = 48.0;
  const drCatastrophicRepairCost = 140000;
  const drDowntimeLoss = drCatastrophicDowntimeHrs * hourlyDowntimeCost;
  const drOrderPenalty = activeOrders * 25000;

  const drExpectedCost = drFailureProb * (drCatastrophicRepairCost + drDowntimeLoss + drOrderPenalty);
  const drFailureRisk = Number((drFailureProb * 100).toFixed(1));
  const drDeliveryRisk = Math.min(95.0, Number((drFailureProb * 90).toFixed(1)));
  const drScore = Math.max(10, 100 - Math.round(drFailureRisk * 1.1));

  // --- 3. REDUCED CAPACITY ---
  const deratedStress = severityFactor * Math.pow(capacityPct / 100.0, 2);
  const rcFailureProb = Math.min(0.35, 0.03 * deratedStress * delayDays);
  const rcCapacityLossPerDay = ((100 - capacityPct) / 100) * (hourlyDowntimeCost * 12);
  const rcRevenueLoss = rcCapacityLossPerDay * delayDays;
  const rcScheduledRepairCost = 38000;
  const rcPlannedDowntimeLoss = 4.0 * hourlyDowntimeCost * 0.7;

  const rcExpectedCost = rcRevenueLoss + rcScheduledRepairCost + rcPlannedDowntimeLoss + (rcFailureProb * drCatastrophicRepairCost);
  const rcFailureRisk = Number((rcFailureProb * 100).toFixed(1));
  const rcDeliveryRisk = Number(Math.min(60.0, (100 - capacityPct) * 0.75).toFixed(1));
  const rcScore = severityFactor <= 1.5 ? 85 : 72;

  const strategies = {
    repair_now: {
      id: 'repair_now',
      name: 'Repair Now (Immediate Maintenance)',
      badge: 'Immediate Action',
      badgeColor: 'cyan',
      totalExpectedCost: Math.round(rnTotalCost),
      repairCost: Math.round(rnRepairCost),
      downtimeLoss: Math.round(rnDowntimeLoss),
      downtimeHours: rnDowntimeHrs,
      failureRiskPct: rnFailureRisk,
      deliveryRiskPct: rnDeliveryRisk,
      resilienceScore: rnScore,
      pros: ['Eliminates catastrophic breakdown risk', 'Uses in-stock parts immediately', 'Fastest restoration to 100% capacity'],
      cons: ['Immediate 4-hour production stoppage'],
    },
    reduced_capacity: {
      id: 'reduced_capacity',
      name: `Operate at Reduced Capacity (${Math.round(capacityPct)}%)`,
      badge: 'Balanced De-Rate',
      badgeColor: 'amber',
      totalExpectedCost: Math.round(rcExpectedCost),
      repairCost: Math.round(rcScheduledRepairCost),
      downtimeLoss: Math.round(rcRevenueLoss + rcPlannedDowntimeLoss),
      downtimeHours: 4.0,
      failureRiskPct: rcFailureRisk,
      deliveryRiskPct: rcDeliveryRisk,
      resilienceScore: rcScore,
      pros: ['Maintains partial order throughput', 'Schedules maintenance during off-peak hours', 'Significant stress reduction'],
      cons: ['Accumulates daily capacity revenue loss', 'Requires active order rerouting'],
    },
    delay_repair: {
      id: 'delay_repair',
      name: `Delay Repair (${delayDays} Days)`,
      badge: 'High Risk Deferral',
      badgeColor: 'rose',
      totalExpectedCost: Math.round(drExpectedCost),
      repairCost: Math.round(drCatastrophicRepairCost * drFailureProb),
      downtimeLoss: Math.round(drDowntimeLoss * drFailureProb),
      downtimeHours: Number((drCatastrophicDowntimeHrs * drFailureProb).toFixed(1)),
      failureRiskPct: drFailureRisk,
      deliveryRiskPct: drDeliveryRisk,
      resilienceScore: drScore,
      pros: ['Zero immediate downtime today'],
      cons: ['Exponentially escalating failure risk', 'Potential 48h catastrophic outage', 'Severe financial penalty'],
    },
  };

  const bestId = Object.keys(strategies).reduce((a, b) => (strategies[a].resilienceScore > strategies[b].resilienceScore ? a : b));

  return {
    params: { vibrationLevel, temperature, hourlyDowntimeCost, activeOrders, delayDays, capacityPct, severityFactor: Number(severityFactor.toFixed(2)) },
    bestStrategyId: bestId,
    strategies,
    costSavingsVsDelay: Math.round(drExpectedCost - strategies[bestId].totalExpectedCost),
  };
}

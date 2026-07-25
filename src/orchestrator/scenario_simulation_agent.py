"""ScenarioSimulationAgent for Decision Twin System.

Performs quantitative rule-based simulation comparing three operational strategies:
1. Repair Now (immediate_repair)
2. Delay Repair (delay_repair)
3. Reduced Capacity (reduced_capacity)

Computes expected costs, risk scores, downtime, delivery impact, and ROI matrices.
"""

from __future__ import annotations
import math
from typing import Dict, Any, List

def calculate_strategy_metrics(
    vibration_level: float = 6.5,
    temperature: float = 85.0,
    hourly_downtime_cost: float = 12500.0,
    active_orders: int = 3,
    delay_days: int = 7,
    capacity_pct: float = 60.0
) -> Dict[str, Any]:
    """Calculate quantitative metrics for all 3 maintenance strategies."""

    # Base severity coefficient
    severity_factor = max(1.0, (vibration_level / 5.0) * (temperature / 80.0))

    # --- 1. REPAIR NOW ---
    rn_downtime_hrs = 4.0
    rn_repair_cost = 45000.0
    rn_downtime_loss = rn_downtime_hrs * hourly_downtime_cost
    rn_total_cost = rn_repair_cost + rn_downtime_loss
    rn_failure_risk = 2.0  # % after repair
    rn_delivery_risk = 5.0  # % (reroute absorbs 4 hrs)
    rn_score = 92 if severity_factor > 1.2 else 80

    # --- 2. DELAY REPAIR ---
    # Failure probability escalates exponentially over delay days
    base_daily_risk = min(0.25, 0.05 * severity_factor)
    dr_failure_prob = min(0.95, 1.0 - math.exp(-base_daily_risk * delay_days))
    dr_catastrophic_downtime_hrs = 48.0
    dr_catastrophic_repair_cost = 140000.0  # secondary damage to motor/spindle
    dr_downtime_loss = dr_catastrophic_downtime_hrs * hourly_downtime_cost
    dr_order_penalty = active_orders * 25000.0

    dr_expected_cost = (
        dr_failure_prob * (dr_catastrophic_repair_cost + dr_downtime_loss + dr_order_penalty)
    )
    dr_failure_risk = round(dr_failure_prob * 100, 1)
    dr_delivery_risk = min(95.0, round(dr_failure_prob * 90, 1))
    dr_score = max(10, 100 - int(dr_failure_risk * 1.1))

    # --- 3. REDUCED CAPACITY ---
    # Capacity reduction lowers stress factor
    derated_stress = severity_factor * (capacity_pct / 100.0) ** 2
    rc_failure_prob = min(0.35, 0.03 * derated_stress * delay_days)
    rc_capacity_loss_per_day = (100.0 - capacity_pct) / 100.0 * (hourly_downtime_cost * 12)  # 12 operating hrs/day
    rc_revenue_loss = rc_capacity_loss_per_day * delay_days
    rc_scheduled_repair_cost = 38000.0  # planned off-peak repair cost
    rc_planned_downtime_loss = 4.0 * hourly_downtime_cost * 0.7  # 30% off-peak discount

    rc_expected_cost = rc_revenue_loss + rc_scheduled_repair_cost + rc_planned_downtime_loss + (rc_failure_prob * dr_catastrophic_repair_cost)
    rc_failure_risk = round(rc_failure_prob * 100, 1)
    rc_delivery_risk = round(min(60.0, (100.0 - capacity_pct) * 0.75), 1)
    rc_score = 85 if severity_factor <= 1.5 else 72

    strategies = {
        "repair_now": {
            "id": "repair_now",
            "name": "Repair Now (Immediate Maintenance)",
            "total_expected_cost": round(rn_total_cost, 2),
            "repair_cost": round(rn_repair_cost, 2),
            "downtime_loss": round(rn_downtime_loss, 2),
            "downtime_hours": rn_downtime_hrs,
            "failure_risk_pct": rn_failure_risk,
            "delivery_risk_pct": rn_delivery_risk,
            "resilience_score": rn_score,
            "recommendation_rank": 1 if rn_score >= max(dr_score, rc_score) else 2,
            "pros": ["Eliminates catastrophic breakdown risk", "Uses in-stock parts immediately", "Fastest restoration to 100% capacity"],
            "cons": ["Immediate 4-hour production stoppage"],
        },
        "reduced_capacity": {
            "id": "reduced_capacity",
            "name": "Operate at Reduced Capacity (De-rate to " + str(int(capacity_pct)) + "%)",
            "total_expected_cost": round(rc_expected_cost, 2),
            "repair_cost": round(rc_scheduled_repair_cost, 2),
            "downtime_loss": round(rc_revenue_loss + rc_planned_downtime_loss, 2),
            "downtime_hours": 4.0,  # Scheduled off-peak
            "failure_risk_pct": rc_failure_risk,
            "delivery_risk_pct": rc_delivery_risk,
            "resilience_score": rc_score,
            "recommendation_rank": 2 if rn_score >= max(dr_score, rc_score) else 1,
            "pros": ["Maintains partial order throughput", "Schedules maintenance during off-peak hours", "Significant stress reduction"],
            "cons": ["Accumulates daily capacity revenue loss", "Requires active rerouting"],
        },
        "delay_repair": {
            "id": "delay_repair",
            "name": "Delay Repair (" + str(delay_days) + " Days)",
            "total_expected_cost": round(dr_expected_cost, 2),
            "repair_cost": round(dr_catastrophic_repair_cost * dr_failure_prob, 2),
            "downtime_loss": round(dr_downtime_loss * dr_failure_prob, 2),
            "downtime_hours": round(dr_catastrophic_downtime_hrs * dr_failure_prob, 1),
            "failure_risk_pct": dr_failure_risk,
            "delivery_risk_pct": dr_delivery_risk,
            "resilience_score": dr_score,
            "recommendation_rank": 3,
            "pros": ["Zero immediate downtime today"],
            "cons": ["Exponentially escalating failure risk", "Potential 48h catastrophic outage", "Severe financial penalty"],
        },
    }

    # Best recommendation determination
    best_id = max(strategies.keys(), key=lambda k: strategies[k]["resilience_score"])
    
    return {
        "parameters_evaluated": {
            "vibration_level": vibration_level,
            "temperature": temperature,
            "hourly_downtime_cost": hourly_downtime_cost,
            "active_orders": active_orders,
            "delay_days": delay_days,
            "capacity_pct": capacity_pct,
            "severity_factor": round(severity_factor, 2),
        },
        "best_strategy_id": best_id,
        "strategies": strategies,
        "cost_savings_vs_delay": round(dr_expected_cost - strategies[best_id]["total_expected_cost"], 2),
    }


def scenario_simulation_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """LangGraph agent node for Scenario Simulation.

    Takes DecisionTwinState, evaluates numerical options, and updates blackboard & proposals.
    """
    event = state.get("event", {})
    bb = state.get("blackboard", {})
    sensor_data = bb.get("sensor_agent", {}).get("readings", {})
    finance_data = bb.get("finance_agent", {})

    vibration = float(event.get("vibration_level") or sensor_data.get("vibration", 6.5))
    temperature = float(event.get("temperature") or sensor_data.get("temperature", 85.0))
    hourly_cost = float(finance_data.get("hourly_downtime_cost", 12500.0))

    simulation_results = calculate_strategy_metrics(
        vibration_level=vibration,
        temperature=temperature,
        hourly_downtime_cost=hourly_cost,
    )

    best_strat = simulation_results["strategies"][simulation_results["best_strategy_id"]]

    proposal = {
        "source": "scenario_simulation_agent",
        "action": simulation_results["best_strategy_id"],
        "reason": (
            f"Numeric simulation ranks {best_strat['name']} #1 (Score: {best_strat['resilience_score']}/100). "
            f"Saves ${simulation_results['cost_savings_vs_delay']:,} compared to delaying repair."
        ),
        "confidence": 0.88,
        "matrix": simulation_results,
    }

    return {
        "blackboard": {"scenario_simulation_agent": simulation_results},
        "agents_completed": ["scenario_simulation_agent"],
        "proposals": [proposal],
        "trace": [
            f"     [ScenarioSimulationAgent] Evaluated 3 strategies:",
            f"       1. Repair Now        : Expected Cost = ${simulation_results['strategies']['repair_now']['total_expected_cost']:,} (Risk: {simulation_results['strategies']['repair_now']['failure_risk_pct']}%)",
            f"       2. Reduced Capacity  : Expected Cost = ${simulation_results['strategies']['reduced_capacity']['total_expected_cost']:,} (Risk: {simulation_results['strategies']['reduced_capacity']['failure_risk_pct']}%)",
            f"       3. Delay Repair ({simulation_results['parameters_evaluated']['delay_days']}d): Expected Cost = ${simulation_results['strategies']['delay_repair']['total_expected_cost']:,} (Risk: {simulation_results['strategies']['delay_repair']['failure_risk_pct']}%)",
            f"       Recommendation: {simulation_results['best_strategy_id']} (Savings vs Delay: ${simulation_results['cost_savings_vs_delay']:,})",
        ],
    }

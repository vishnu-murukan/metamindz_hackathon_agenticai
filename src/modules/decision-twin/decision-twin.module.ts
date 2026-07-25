import { Module } from '@nitrostack/core';
import { DecisionTwinTools } from './decision-twin.tools.js';
import { DecisionTwinResources } from './decision-twin.resources.js';
import { DecisionTwinPrompts } from './decision-twin.prompts.js';
import { ScenarioSimulationAgent } from './scenario_simulation_agent.js';

@Module({
  name: 'decision-twin',
  description: 'Decision Twin MCP module for manufacturing operations, telemetry, risk calculation, work orders, and scenario simulation',
  controllers: [DecisionTwinTools, DecisionTwinResources, DecisionTwinPrompts, ScenarioSimulationAgent]
})
export class DecisionTwinModule {}

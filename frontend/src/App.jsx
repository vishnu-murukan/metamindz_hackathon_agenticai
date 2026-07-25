import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ExecutiveSummary from './components/ExecutiveSummary';
import NegotiationTranscript from './components/NegotiationTranscript';
import ScenarioMatrix from './components/ScenarioMatrix';
import BackendAdapterModal from './components/BackendAdapterModal';
import { runSimulation } from './services/SimulationService';
import { NegotiationController } from './services/NegotiationService';

export default function App() {
  // Scenario Parameters State
  const [params, setParams] = useState({
    vibrationLevel: 6.5,
    temperature: 85.0,
    hourlyDowntimeCost: 12500,
    activeOrders: 3,
    delayDays: 7,
    capacityPct: 60,
  });

  // Simulation & Negotiation State
  const [simResults, setSimResults] = useState(() => runSimulation(params));
  const [messages, setMessages] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [useRealBackend, setUseRealBackend] = useState(false);

  const controllerRef = useRef(null);

  // Initialize or Restart Negotiation Stream
  const initNegotiationStream = (currentParams) => {
    if (controllerRef.current) {
      controllerRef.current.pause();
    }

    setMessages([]);
    setIsLive(true);
    setIsPaused(false);

    controllerRef.current = new NegotiationController(
      currentParams,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
      () => {
        setIsLive(false);
      }
    );

    controllerRef.current.start();
  };

  useEffect(() => {
    const results = runSimulation(params);
    setSimResults(results);
    initNegotiationStream(params);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.pause();
      }
    };
  }, []);

  // Handle Parameter Slider Changes
  const handleParamChange = (key, value) => {
    const updatedParams = { ...params, [key]: value };
    setParams(updatedParams);

    const newResults = runSimulation(updatedParams);
    setSimResults(newResults);

    // Restart negotiation stream with new parameters
    initNegotiationStream(updatedParams);
  };

  // Play / Pause Controls
  const handleTogglePlay = () => {
    if (!controllerRef.current) return;
    if (isPaused) {
      controllerRef.current.resume();
      setIsPaused(false);
    } else {
      controllerRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleRestart = () => {
    initNegotiationStream(params);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        isLive={isLive}
        isPaused={isPaused}
        onTogglePlay={handleTogglePlay}
        onRestart={handleRestart}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        useRealBackend={useRealBackend}
      />

      {/* Main Layout Container */}
      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px 40px', flex: 1 }}>
        
        {/* Executive Summary Card */}
        <ExecutiveSummary simResults={simResults} vibrationLevel={params.vibrationLevel} />

        {/* Dual-Column Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Column: Live Agent Negotiation Stream */}
          <div>
            <NegotiationTranscript
              messages={messages}
              isLive={isLive}
              isPaused={isPaused}
            />
          </div>

          {/* Right Column: Interactive Numeric Scenario Matrix & Controls */}
          <div>
            <ScenarioMatrix
              params={params}
              onChangeParam={handleParamChange}
              simResults={simResults}
            />
          </div>

        </div>

      </main>

      {/* Backend Adapter Modal */}
      <BackendAdapterModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        useRealBackend={useRealBackend}
        onToggleBackend={() => setUseRealBackend(!useRealBackend)}
      />

    </div>
  );
}

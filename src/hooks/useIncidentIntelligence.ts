import { useState, useCallback } from 'react';
import { 
  RawEventInput, 
  NormalizedIncident, 
  IntelligencePipelineStage 
} from '../types/incident';
import { IncidentAnalyzer } from '../services/incident/incidentAnalyzer';
import { useCityStore } from '../stores/useCityStore';

export function useIncidentIntelligence() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<IntelligencePipelineStage | null>(null);

  const analyzer = new IncidentAnalyzer();
  const aiModeName = analyzer.getAIModeName();

  const processIncomingEvent = useCallback(async (
    input: RawEventInput,
    onComplete?: (incident: NormalizedIncident, isCorrelated: boolean) => void
  ) => {
    setIsProcessing(true);

    const storeIncidents = useCityStore.getState().normalizedIncidents;

    const result = await analyzer.processRawEvent(
      input,
      storeIncidents,
      (stageUpdate) => {
        setCurrentStage(stageUpdate);
      }
    );

    useCityStore.setState((state) => {
      const logs = [
        ...state.aiActivityLogs,
        `[AI INTELLIGENCE] ${result.isCorrelated ? 'Correlated' : 'Structured'} incident ${result.incident.id} (${result.incident.type}) — Priority #${result.incident.priorityRank}`
      ].slice(-10);

      const mergedList = state.normalizedIncidents.map(i => i.id === result.incident.id ? { ...i, ...result.incident } : i);
      if (!mergedList.some(i => i.id === result.incident.id)) {
        mergedList.unshift(result.incident as any);
      }

      return {
        normalizedIncidents: mergedList as any,
        selectedIncidentId: result.incident.id,
        cameraMode: 'INCIDENT_FOCUS',
        cameraTarget: result.incident.position3D,
        aiActivityLogs: logs
      };
    });

    setIsProcessing(false);
    onComplete?.(result.incident, result.isCorrelated);
  }, []);

  return {
    aiModeName,
    isProcessing,
    currentStage,
    processIncomingEvent
  };
}

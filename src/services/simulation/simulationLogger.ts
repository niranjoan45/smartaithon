import { SimulationEventLog } from '../../types/simulation';

export class SimulationLogger {
  private logs: SimulationEventLog[] = [];

  public logEvent(
    simTimeStr: string,
    eventType: string,
    entityId: string,
    description: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO'
  ): SimulationEventLog {
    const newLog: SimulationEventLog = {
      id: `SIM-LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      simTimestamp: simTimeStr,
      realTimestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      eventType,
      entityId,
      description,
      severity
    };

    this.logs.unshift(newLog);
    if (this.logs.length > 50) this.logs.pop();

    return newLog;
  }

  public getLogs(): SimulationEventLog[] {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const simulationLogger = new SimulationLogger();

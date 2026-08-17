export class SimulationClock {
  private elapsedSeconds: number = 0;
  private isRunning: boolean = false;
  private speedMultiplier: number = 1.0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onTickCallbacks: Array<(elapsedSec: number) => void> = [];

  public start(onTick?: (elapsedSec: number) => void) {
    if (onTick && !this.onTickCallbacks.includes(onTick)) {
      this.onTickCallbacks.push(onTick);
    }
    if (this.isRunning) return;

    this.isRunning = true;
    this.scheduleTick();
  }

  public pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public reset() {
    this.pause();
    this.elapsedSeconds = 0;
    this.notifyTick();
  }

  public setSpeed(speed: number) {
    this.speedMultiplier = speed;
    if (this.isRunning) {
      this.pause();
      this.start();
    }
  }

  public stepTick() {
    this.elapsedSeconds += 1;
    this.notifyTick();
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  public getFormattedTime(): string {
    const baseHour = 20;
    const totalSec = this.elapsedSeconds;
    const hours = Math.floor(totalSec / 3600) + baseHour;
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const hh = String(hours % 24).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  private scheduleTick() {
    const intervalMs = Math.max(100, Math.round(1000 / this.speedMultiplier));
    this.intervalId = setInterval(() => {
      if (this.isRunning) {
        this.elapsedSeconds += 1;
        this.notifyTick();
      }
    }, intervalMs);
  }

  private notifyTick() {
    this.onTickCallbacks.forEach(cb => cb(this.elapsedSeconds));
  }
}

export const simulationClock = new SimulationClock();

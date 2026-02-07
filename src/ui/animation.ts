const FRAME_INTERVAL_MS = 400;

export class AnimationController {
  private rafId: number | null = null;
  private lastTimestamp = 0;
  private _currentFrame = 0;

  get currentFrame(): number {
    return this._currentFrame;
  }

  start(onTick: () => void): void {
    this.stop();
    this.lastTimestamp = 0;

    const loop = (timestamp: number) => {
      if (this.lastTimestamp === 0) this.lastTimestamp = timestamp;

      if (timestamp - this.lastTimestamp >= FRAME_INTERVAL_MS) {
        this.lastTimestamp = timestamp;
        this._currentFrame = (this._currentFrame + 1) % 4;
        onTick();
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this._currentFrame = 0;
  }

  get isRunning(): boolean {
    return this.rafId !== null;
  }
}

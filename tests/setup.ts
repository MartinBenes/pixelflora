// Canvas mock for Node.js test environment
class MockCanvasRenderingContext2D {
  fillStyle = '';
  strokeStyle = '';
  private _pixels: Map<string, string> = new Map();
  private _outOfBoundsWrites = 0;
  readonly canvas: { width: number; height: number };

  constructor(private readonly getBounds: () => { width: number; height: number }) {
    this.canvas = {
      get width() {
        return getBounds().width;
      },
      get height() {
        return getBounds().height;
      },
    };
  }

  fillRect(x: number, y: number, w: number, h: number) {
    const { width, height } = this.getBounds();
    for (let px = Math.round(x); px < Math.round(x + w); px++) {
      for (let py = Math.round(y); py < Math.round(y + h); py++) {
        if (px < 0 || py < 0 || px >= width || py >= height) {
          this._outOfBoundsWrites++;
          continue;
        }

        this._pixels.set(`${px},${py}`, this.fillStyle);
      }
    }
  }

  clearRect(_x: number, _y: number, _w: number, _h: number) {
    this._pixels.clear();
  }

  getImageData(x: number, y: number, w: number, h: number) {
    const data = new Uint8ClampedArray(w * h * 4);
    return { data, width: w, height: h };
  }

  putImageData() {}

  // Expose pixel data for test assertions
  getPixel(x: number, y: number): string | undefined {
    return this._pixels.get(`${x},${y}`);
  }

  getPixelCount(): number {
    return this._pixels.size;
  }

  getSignature(): string {
    const entries = [...this._pixels.entries()].sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([position, color]) => `${position}:${color}`).join('|');
  }

  getOutOfBoundsWriteCount(): number {
    return this._outOfBoundsWrites;
  }
}

class MockCanvas {
  width = 192;
  height = 288;
  private _ctx: MockCanvasRenderingContext2D;

  constructor() {
    this._ctx = new MockCanvasRenderingContext2D(() => ({
      width: this.width,
      height: this.height,
    }));
  }

  getContext(_type: string) {
    return this._ctx;
  }

  toDataURL() {
    return 'data:image/png;base64,mock';
  }
}

export function createMockCanvas(width = 192, height = 288): MockCanvas {
  const canvas = new MockCanvas();
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export { MockCanvas, MockCanvasRenderingContext2D };

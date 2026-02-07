import type { CanvasContext, CanvasLike } from '@/core/types';

export function getRequiredContext2D(canvas: CanvasLike): CanvasContext {
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to acquire 2D canvas context.');
  }

  return context;
}

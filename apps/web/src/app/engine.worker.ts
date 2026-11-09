/// <reference lib="webworker" />
import { assess, OVERNIGHT_EXAMPLE, type HomeProfile } from '@soltara/engine';

/** Runs the Soltara assessment off the main thread so the page stays responsive while a control is dragged.
 *  Replies with the result and the measured compute time for that run. */
self.onmessage = (e: MessageEvent<{ id: number; home: HomeProfile }>) => {
  const t0 = performance.now();
  const result = assess(e.data.home, OVERNIGHT_EXAMPLE);
  self.postMessage({ id: e.data.id, result, ms: performance.now() - t0 });
};

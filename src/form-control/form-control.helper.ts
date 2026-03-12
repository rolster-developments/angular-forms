import { Signal, WritableSignal } from '@angular/core';

export function signalIsWritable(
  value: Signal<unknown>
): value is WritableSignal<unknown> {
  return 'set' in value;
}

export function setValueInSignal<T>(signal: Signal<T>, value: T): void {
  signalIsWritable(signal) && signal.set(value);
}

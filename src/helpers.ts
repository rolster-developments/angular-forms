import { Signal, WritableSignal } from '@angular/core';
import {
  AbstractAngularControl,
  AbstractAngularControls,
  AngularControlsData,
  AngularFormGroupOptions,
  ValidatorGroupFn
} from './types';

export function signalIsWritable(
  value: Signal<unknown>
): value is WritableSignal<unknown> {
  return 'set' in value;
}

export function setValueInSignal<T>(signal: Signal<T>, value: T): void {
  signalIsWritable(signal) && signal.set(value);
}

type AngularArrayControlToBoolean<T = any> = (
  control: AbstractAngularControl<T>
) => boolean;

export function reduceControlsBoolean<
  C extends AbstractAngularControls = AbstractAngularControls
>(controls: C, controlToBoolean: AngularArrayControlToBoolean): boolean {
  return Object.values(controls).reduce((value, control) => {
    return value && controlToBoolean(control);
  }, true);
}

export const controlsToData = <C extends AbstractAngularControls>(
  controls: C
): AngularControlsData<C> => {
  return Object.entries(controls).reduce((result, [key, { value }]) => {
    result[key as keyof C] = value();

    return result;
  }, {} as AngularControlsData<C>);
};

type ArgsGroupOptions<C extends AbstractAngularControls> = [
  AngularFormGroupOptions<C> | C,
  Undefined<ValidatorGroupFn<C>[]>
];

function groupIsOptions<
  C extends AbstractAngularControls,
  O extends AngularFormGroupOptions<C>
>(options: any): options is O {
  return typeof options === 'object' && 'controls' in options;
}

export function createFormGroupOptions<
  C extends AbstractAngularControls,
  O extends AngularFormGroupOptions<C>
>(...groupOptions: ArgsGroupOptions<C>): O {
  const [options, validators] = groupOptions;

  if (!validators && groupIsOptions<C, O>(options)) {
    return options;
  }

  return {
    controls: options as C,
    validators
  } as O;
}

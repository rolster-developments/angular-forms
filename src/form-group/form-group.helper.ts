import { isSignal } from '@angular/core';
import { parseBoolean } from '@rolster/commons';
import { ValidatorError } from '@rolster/validators';
import { AngularFormControl } from '../form-control/form-control.type';
import {
  AbstractAngularControls,
  AngularControlsSignal,
  AngularControlsValue,
  AngularFormGroupOptions,
  ValidatorGroupFn
} from './form-group.type';

type GroupArgsOptions<C extends AbstractAngularControls> = [
  AngularFormGroupOptions<C> | C,
  Undefined<ValidatorGroupFn<C>[]>
];

interface GroupValidOptions<T extends AbstractAngularControls> {
  controls: T;
  validators: ValidatorGroupFn<T>[];
}

function valueIsGroupOptions<
  C extends AbstractAngularControls,
  O extends AngularFormGroupOptions<C>
>(value: any): value is O {
  return typeof value === 'object' && 'controls' in value;
}

export function createFormGroupOptions<
  C extends AbstractAngularControls,
  O extends AngularFormGroupOptions<C>
>(...argsOptions: GroupArgsOptions<C>): O {
  const [options, validators] = argsOptions;

  if (!validators && valueIsGroupOptions<C, O>(options)) {
    return options;
  }

  return {
    controls: options as C,
    validators
  } as O;
}

export const formGroupIsValid = <C extends AbstractAngularControls>({
  controls,
  validators
}: GroupValidOptions<C>): ValidatorError[] => {
  return validators.reduce((errors, validator) => {
    const error = validator(controls);

    if (error) {
      errors.push(error);
    }

    return errors;
  }, [] as ValidatorError[]);
};

export const controlsToSignal = <C extends AbstractAngularControls>(
  controls: C
): AngularControlsSignal<C> => {
  return Object.entries(controls).reduce((result, [key, { value }]) => {
    result[key as keyof C] = value;

    return result;
  }, {} as AngularControlsSignal<C>);
};

export const controlsToValue = <C extends AbstractAngularControls>(
  controls: C
): AngularControlsValue<C> => {
  return Object.entries(controls).reduce((result, [key, { value }]) => {
    result[key as keyof C] = value();

    return result;
  }, {} as AngularControlsValue<C>);
};

function controlToBoolean<T extends AngularFormControl>(
  control: T,
  key: keyof T
): boolean {
  const value = control[key];

  return parseBoolean(isSignal(value) ? value() : value);
}

export function verifyAllTrueInControls<
  T extends AngularFormControl = AngularFormControl
>(controls: AbstractAngularControls<T>, key: keyof T): boolean {
  return Object.values(controls).reduce(
    (value, control) =>
      control.disabled() ? value : value && controlToBoolean(control, key),
    true
  );
}

export function verifyAnyTrueInControls<
  T extends AngularFormControl = AngularFormControl
>(controls: AbstractAngularControls<T>, key: keyof T): boolean {
  return Object.values(controls).reduce(
    (value, control) =>
      control.disabled() ? value : value || controlToBoolean(control, key),
    false
  );
}

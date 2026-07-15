import { Signal } from '@angular/core';
import { ValidatorError, ValidatorResult } from '@rolster/validators';
import {
  AngularControl,
  AngularFormControl} from '../form-control/form-control.type';

export type AngularFormControls<T extends AngularControl = AngularControl> =
  AbstractAngularControls<T>;

export type AbstractAngularControls<
  T extends AngularFormControl = AngularFormControl
> = Record<string, T>;

export type ValidatorGroupFn<
  C extends AbstractAngularControls = AbstractAngularControls,
  V = any
> = (controls: C) => ValidatorResult<V>;

export type AngularControlsSignal<C extends AbstractAngularControls> = {
  [K in keyof C]: C[K]['value'];
};

export type AngularControlsValue<C extends AbstractAngularControls> = {
  [K in keyof C]: C[K]['data'];
};

export interface AngularFormGroupOptions<
  C extends AbstractAngularControls = AbstractAngularControls
> {
  controls: C;
  validators?: ValidatorGroupFn<C>[];
}

export interface AbstractAngularFormGroup<
  C extends AbstractAngularControls = AbstractAngularControls
> {
  readonly controls: C;
  readonly data: AngularControlsValue<C>;
  readonly dirties: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  readonly pristines: Signal<boolean>;
  reset: () => void;
  setValidators: (validators: ValidatorGroupFn<C>[]) => void;
  setValue(value: Partial<AngularControlsValue<C>>): void;
  readonly touched: Signal<boolean>;
  readonly toucheds: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly untoucheds: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly value: Signal<AngularControlsValue<C>>;
  readonly wrong: Signal<boolean>;
}

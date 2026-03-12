import { Signal } from '@angular/core';
import {
  ValidatorError,
  ValidatorFn,
  ValidatorResult
} from '@rolster/validators';

export interface AbstractAngularControl<T = any> {
  blur: () => void;
  readonly data: T;
  readonly dirty: Signal<boolean>;
  disable: () => void;
  readonly disabled: Signal<boolean>;
  enable: () => void;
  readonly enabled: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  focus: () => void;
  readonly focused: Signal<boolean>;
  hasError: (key: string) => boolean;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  reset: () => void;
  setDefaultValue: (value: T) => void;
  setStartValue: (value: T) => void;
  setValue: (value: T) => void;
  setValidators: (validators?: ValidatorFn<T>[]) => void;
  someErrors: (key: string[]) => boolean;
  touch: () => void;
  readonly touched: Signal<boolean>;
  readonly unfocused: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly value: Signal<T>;
  readonly wrong: Signal<boolean>;
}

export type AngularControl<T = any> = AbstractAngularControl<T>;

export type AngularVoid<T = any> = AngularControl<T | undefined>;

export interface AbstractAngularArrayControl<T = any>
  extends AbstractAngularControl<T> {
  readonly uuid: string;
}

export type AngularArrayControl<T = any> = AbstractAngularArrayControl<T>;

export type AngularArrayVoid<T = any> = AngularArrayControl<T | undefined>;

export type AbstractAngularControls<
  T extends AbstractAngularControl = AbstractAngularControl
> = Record<string, T>;

export type ValidatorGroupFn<
  C extends AbstractAngularControls = AbstractAngularControls,
  V = any
> = (controls: C) => ValidatorResult<V>;

export type AngularControlsSignal<C extends AbstractAngularControls> = {
  [K in keyof C]: C[K]['value'];
};

export type AngularControlsData<C extends AbstractAngularControls> = {
  [K in keyof C]: C[K]['data'];
};

export interface AbstractAngularFormGroup<
  C extends AbstractAngularControls = AbstractAngularControls
> {
  readonly controls: C;
  readonly data: AngularControlsData<C>;
  readonly dirties: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  readonly pristines: Signal<boolean>;
  reset: () => void;
  setValidators: (validators: ValidatorGroupFn<C>[]) => void;
  readonly touched: Signal<boolean>;
  readonly toucheds: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly untoucheds: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly value: Signal<AngularControlsData<C>>;
  readonly wrong: Signal<boolean>;
}

export interface AngularFormGroupOptions<
  C extends AbstractAngularControls = AbstractAngularControls
> {
  controls: C;
  validators?: ValidatorGroupFn<C>[];
}

export type AngularFormControls<T extends AngularControl = AngularControl> =
  AbstractAngularControls<T>;

export type AbstractAngularArrayControls<
  T extends AbstractAngularArrayControl = AbstractAngularArrayControl
> = AbstractAngularControls<T>;

export type AngularArrayControls<
  T extends AngularArrayControl = AngularArrayControl
> = AbstractAngularArrayControls<T>;

export type AngularArrayControlsSignal<C extends AbstractAngularArrayControls> =
  {
    [K in keyof C]: C[K]['value'];
  };

export type AngularArrayControlsData<C extends AbstractAngularArrayControls> = {
  [K in keyof C]: C[K]['data'];
};

export type AngularArrayListValueToControls<
  C extends AngularArrayControls = AngularArrayControls
> = (value: AngularArrayControlsData<C>) => C;

export interface AngularArrayList<
  C extends AngularArrayControls = AngularArrayControls
> extends AbstractAngularArrayControl<AngularArrayControlsData<C>[]> {
  controls: Signal<C[]>;
  push(controls: C): void;
  remove(controls: C): void;
}

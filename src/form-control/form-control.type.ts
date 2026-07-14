import { Signal } from '@angular/core';
import { ValidatorError, ValidatorFn } from '@rolster/validators';

export interface AbstractAngularControl<T = any> {
  readonly data: T;
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly enabled: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  hasError: (key: string) => boolean;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  reset: () => void;
  someErrors: (key: string[]) => boolean;
  readonly touched: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly value: Signal<T>;
  readonly wrong: Signal<boolean>;
}

export interface AngularFormControl<T = any> extends AbstractAngularControl<T> {
  blur: () => void;
  disable: () => void;
  enable: () => void;
  focus: () => void;
  readonly focused: Signal<boolean>;
  setDefaultValue: (value: T) => void;
  setStartValue: (value: T) => void;
  setValidators: (validators?: ValidatorFn<T>[]) => void;
  setValue: (value: T) => void;
  touch: () => void;
  readonly unfocused: Signal<boolean>;
}

export type AngularControl<T = any> = AngularFormControl<T>;

export type AngularVoid<T = any> = AngularControl<T | undefined>;

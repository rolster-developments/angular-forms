import { Signal } from '@angular/core';
import { ValidatorError, ValidatorFn } from '@rolster/validators';

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

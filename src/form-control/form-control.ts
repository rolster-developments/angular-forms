import { signal, WritableSignal } from '@angular/core';
import { FormControlOptions } from '@rolster/forms';
import {
  createFormControlOptions,
  formatInputValue
} from '@rolster/forms/helpers';
import { ValidatorFn } from '@rolster/validators';
import { FormSignalControl } from './form-signal-control';

export interface AngularControlOptions<T = any> extends FormControlOptions<T> {
  touched?: boolean;
}

export type AngularValueOptions<T> = Omit<
  AngularControlOptions<T>,
  'validators'
>;

export type AngularValidatorsOptions<T> = Omit<
  AngularControlOptions<T>,
  'value'
>;

export class FormControl<
  T = any,
  E extends HTMLElement = HTMLElement
> extends FormSignalControl<T, E> {
  private readonly valueState: WritableSignal<T>;

  constructor();
  constructor(options: AngularControlOptions<T>);
  constructor(value: T, validators?: ValidatorFn<T>[]);
  constructor(
    options?: AngularControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const formControl = createFormControlOptions<T, AngularControlOptions<T>>(
      options,
      validators
    );

    const value = formatInputValue(formControl.value, formControl);
    const valueState = signal(value);

    super(
      value,
      {
        dirty: signal(false),
        disabled: signal(false),
        focused: signal(false),
        touched: signal(!!formControl.touched),
        validators: signal(formControl.validators),
        value: valueState
      },
      formControl
    );

    this.valueState = valueState;
  }

  protected writeValue(value: T): void {
    this.valueState.set(value);
  }
}

export type FormVoid<
  T = any,
  E extends HTMLElement = HTMLElement
> = FormControl<T | undefined, E>;

export function angularControl<T, E extends HTMLElement>(): FormControl<
  T | undefined,
  E
>;
export function angularControl<T, E extends HTMLElement>(
  options: AngularValueOptions<T>
): FormControl<T, E>;
export function angularControl<T, E extends HTMLElement>(
  options: AngularValidatorsOptions<T>
): FormControl<T | undefined, E>;
export function angularControl<T, E extends HTMLElement>(
  options: AngularControlOptions<T>
): FormControl<T, E>;
export function angularControl<T, E extends HTMLElement>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormControl<T, E>;
export function angularControl<T, E extends HTMLElement>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormControl<T | undefined, E>;
export function angularControl<T, E extends HTMLElement>(
  options?: AngularControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T, E> {
  return new FormControl<T, E>(
    createFormControlOptions<T, AngularControlOptions<T>>(options, validators)
  );
}

export function formControl<T>(): FormControl<T | undefined>;
export function formControl<T>(options: AngularValueOptions<T>): FormControl<T>;
export function formControl<T>(
  options: AngularValidatorsOptions<T>
): FormControl<T | undefined>;
export function formControl<T>(
  options: AngularControlOptions<T>
): FormControl<T>;
export function formControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormControl<T>;
export function formControl<T>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormControl<T | undefined>;
export function formControl<T>(
  options?: AngularControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T> {
  return angularControl<T, HTMLElement>(
    createFormControlOptions<T, AngularControlOptions<T>>(options, validators)
  );
}

export function inputControl<T>(): FormControl<T | undefined, HTMLInputElement>;
export function inputControl<T>(
  options: AngularValueOptions<T>
): FormControl<T, HTMLInputElement>;
export function inputControl<T>(
  options: AngularValidatorsOptions<T>
): FormControl<T | undefined, HTMLInputElement>;
export function inputControl<T>(
  options: AngularControlOptions<T>
): FormControl<T, HTMLInputElement>;
export function inputControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormControl<T, HTMLInputElement>;
export function inputControl<T>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormControl<T | undefined, HTMLInputElement>;
export function inputControl<T>(
  options?: AngularControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T, HTMLInputElement> {
  return angularControl<T, HTMLInputElement>(
    createFormControlOptions<T, AngularControlOptions<T>>(options, validators)
  );
}

export function areaControl(): FormControl<
  string | undefined,
  HTMLTextAreaElement
>;
export function areaControl(
  options: AngularValueOptions<string>
): FormControl<string, HTMLTextAreaElement>;
export function areaControl(
  options: AngularControlOptions<string>
): FormControl<string, HTMLTextAreaElement>;
export function areaControl(
  value: string,
  validators?: ValidatorFn<string>[]
): FormControl<string, HTMLTextAreaElement>;
export function areaControl(
  value: Undefined<string>,
  validators?: ValidatorFn<string>[]
): FormControl<string | undefined, HTMLTextAreaElement>;
export function areaControl(
  options?: AngularControlOptions<string> | string,
  validators?: ValidatorFn<string>[]
):
  | FormControl<string, HTMLTextAreaElement>
  | FormControl<string | undefined, HTMLTextAreaElement> {
  return angularControl<string, HTMLTextAreaElement>(
    createFormControlOptions<string, AngularControlOptions<string>>(
      options,
      validators
    )
  );
}

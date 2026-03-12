import { computed, signal } from '@angular/core';
import {
  FormControlOptions,
  FormValidatorsOptions,
  FormValueOptions
} from '@rolster/forms';
import { createFormControlOptions } from '@rolster/forms/arguments';
import { ValidatorError, ValidatorFn } from '@rolster/validators';
import { FormSignalControl } from './form-signal-control';

export class FormControl<T = any> extends FormSignalControl<T> {
  constructor();
  constructor(options: FormControlOptions<T>);
  constructor(value: T, validators?: ValidatorFn<T>[]);
  constructor(
    options?: FormControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const formControl = createFormControlOptions(options, validators);

    const focused = signal(false);
    const touched = signal(false);
    const dirty = signal(false);
    const disabled = signal(false);
    const valid = signal(true);
    const errors = signal<ValidatorError[]>([]);

    super(
      formControl.value,
      {
        dirty,
        disabled,
        enabled: computed(() => !disabled()),
        error: computed(() => errors()[0]),
        errors,
        focused,
        invalid: computed(() => !valid()),
        pristine: computed(() => !dirty()),
        touched,
        unfocused: computed(() => !focused()),
        untouched: computed(() => !touched()),
        valid,
        value: signal(formControl.value),
        wrong: computed(() => touched() && !valid())
      },
      formControl.validators
    );
  }
}

export type FormVoid<T = any> = FormControl<T | undefined>;

export function formControl<T>(): FormControl<T | undefined>;
export function formControl<T>(options: FormValueOptions<T>): FormControl<T>;
export function formControl<T>(
  options: FormValidatorsOptions<T>
): FormControl<T | undefined>;
export function formControl<T>(options: FormControlOptions<T>): FormControl<T>;
export function formControl<T>(
  value: undefined,
  validators?: ValidatorFn<T>[]
): FormControl<T | undefined>;
export function formControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormControl<T>;
export function formControl<T>(
  options?: FormControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T> {
  return new FormControl(createFormControlOptions(options, validators));
}

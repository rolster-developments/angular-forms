import { Signal, WritableSignal, signal } from '@angular/core';
import {
  FormControl as RolsterFormControl,
  FormControlOptions,
  FormStateOptions,
  FormValidatorsOptions
} from '@rolster/forms';
import { createFormControlOptions } from '@rolster/forms/arguments';
import { ValidatorFn } from '@rolster/validators';
import { AngularControl } from './types';

export class FormControl<T = any>
  extends RolsterFormControl<T>
  implements AngularControl<T>
{
  private currentSignal: WritableSignal<T>;

  constructor();
  constructor(options: FormControlOptions<T>);
  constructor(state: T, validators?: ValidatorFn<T>[]);
  constructor(
    controlOptions?: FormControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const options = createFormControlOptions(controlOptions, validators);

    super(options);

    this.currentSignal = signal(options.value);
  }

  public get signal(): Signal<T> {
    return this.currentSignal;
  }

  public setValue(state: T): void {
    this.currentSignal.set(state);
    super.setValue(state);
  }
}

export function formControl<T>(): FormControl<T | undefined>;
export function formControl<T>(options: FormStateOptions<T>): FormControl<T>;
export function formControl<T>(
  options: FormValidatorsOptions<T>
): FormControl<T | undefined>;
export function formControl<T>(
  state: T,
  validators?: ValidatorFn<T>[]
): FormControl<T>;
export function formControl<T>(
  options?: FormControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T> {
  return new FormControl(createFormControlOptions(options, validators));
}

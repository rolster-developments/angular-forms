import { Signal, WritableSignal, signal } from '@angular/core';
import {
  FormControl as RolsterFormControl,
  FormControlProps,
  FormStateProps,
  FormValidatorsProps,
  createFormControlProps
} from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import { AngularControl } from './types';

export class FormControl<T = any>
  extends RolsterFormControl<T>
  implements AngularControl<T>
{
  private currentSignal: WritableSignal<T>;

  constructor();
  constructor(props: FormControlProps<T>);
  constructor(state: T, validators?: ValidatorFn<T>[]);
  constructor(
    controlProps?: FormControlProps<T> | T,
    controlValidators?: ValidatorFn<T>[]
  ) {
    const props = createFormControlProps(controlProps, controlValidators);

    super(props);

    this.currentSignal = signal(props.state);
  }

  public get signal(): Signal<T> {
    return this.currentSignal;
  }

  public setState(state: T): void {
    this.currentSignal.set(state);
    super.setState(state);
  }
}

export function formControl<T>(): FormControl<T | undefined>;
export function formControl<T>(props: FormStateProps<T>): FormControl<T>;
export function formControl<T>(
  props: FormValidatorsProps<T>
): FormControl<T | undefined>;
export function formControl<T>(
  state: T,
  validators?: ValidatorFn<T>[]
): FormControl<T>;
export function formControl<T>(
  props?: FormControlProps<T> | T,
  validators?: ValidatorFn<T>[]
): FormControl<T> {
  return new FormControl(createFormControlProps(props, validators));
}

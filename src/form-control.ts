import { Signal, WritableSignal, signal } from '@angular/core';
import {
  FormControlProps,
  FormState,
  FormControl as RolsterFormControl,
  createFormControlProps
} from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import { AngularControl } from './types';

export class FormControl<T = any>
  extends RolsterFormControl<T>
  implements AngularControl<T>
{
  private currentSignal: WritableSignal<FormState<T>>;

  constructor();
  constructor(props: FormControlProps<T>);
  constructor(state: FormState<T>, validators?: ValidatorFn<T>[]);
  constructor(
    controlProps?: FormControlProps<T> | FormState<T>,
    controlValidators?: ValidatorFn<T>[]
  ) {
    const props = createFormControlProps(controlProps, controlValidators);

    super(props);

    this.currentSignal = signal(props.state);
  }

  public get signal(): Signal<FormState<T>> {
    return this.currentSignal;
  }
}

import { FormArrayControlOptions } from '@rolster/forms';
import { createFormControlOptions } from '@rolster/forms/arguments';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormControl } from '../form-control';
import { AngularArrayControl } from '../types';

type AngularControlOptions<T> = Omit<FormArrayControlOptions<T>, 'uuid'>;

export class FormArrayControl<T = any>
  extends FormControl<T>
  implements AngularArrayControl<T>
{
  public readonly uuid: string;

  constructor();
  constructor(props: AngularControlOptions<T>);
  constructor(state: T, validators?: ValidatorFn<T>[]);
  constructor(
    controlOptions?: AngularControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const options = createFormControlOptions(controlOptions, validators);

    super(options);

    this.uuid = uuid();
  }
}

type ArrayStateOptions<T> = Omit<AngularControlOptions<T>, 'validators'>;
type ArrayValidatorsOptions<T> = Omit<AngularControlOptions<T>, 'state'>;

export function formArrayControl<T>(): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options: ArrayStateOptions<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  options: ArrayValidatorsOptions<T>
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  state: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T>;
export function formArrayControl<T>(
  options?: AngularControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T> {
  return new FormArrayControl(createFormControlOptions(options, validators));
}

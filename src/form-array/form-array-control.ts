import { FormArrayControlOptions } from '@rolster/forms';
import { createFormControlOptions } from '@rolster/forms/helpers';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormControl } from '../form-control/form-control';
import { AngularArrayControl } from './form-array-control.type';

type AngularArrayControlOptions<T> = Omit<FormArrayControlOptions<T>, 'uuid'>;

export class FormArrayControl<T = any>
  extends FormControl<T>
  implements AngularArrayControl<T>
{
  public readonly uuid: string;

  constructor();
  constructor(options: AngularArrayControlOptions<T>);
  constructor(state: T, validators?: ValidatorFn<T>[]);
  constructor(
    options?: AngularArrayControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const formControl = createFormControlOptions(options, validators);

    super(formControl);

    this.uuid = uuid();
  }
}

export type FormArrayVoid<T = any> = FormArrayControl<T | undefined>;

type ArrayValueOptions<T> = Omit<AngularArrayControlOptions<T>, 'validators'>;
type ArrayValidatorsOptions<T> = Omit<AngularArrayControlOptions<T>, 'value'>;

export function formArrayControl<T>(): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options: ArrayValueOptions<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  options: ArrayValidatorsOptions<T>
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options: AngularArrayControlOptions<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  value: undefined,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T>;
export function formArrayControl<T>(
  options?: AngularArrayControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T> {
  return new FormArrayControl(createFormControlOptions(options, validators));
}

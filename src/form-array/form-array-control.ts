import { FormArrayControlProps, createFormControlProps } from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormControl } from '../form-control';
import { AngularArrayControl } from '../types';

type AngularControlProps<T> = Omit<FormArrayControlProps<T>, 'uuid'>;

export class FormArrayControl<T = any>
  extends FormControl<T>
  implements AngularArrayControl<T>
{
  public readonly uuid: string;

  constructor();
  constructor(props: AngularControlProps<T>);
  constructor(state: T, validators?: ValidatorFn<T>[]);
  constructor(
    controlProps?: AngularControlProps<T> | T,
    controlValidators?: ValidatorFn<T>[]
  ) {
    const props = createFormControlProps(controlProps, controlValidators);

    super(props);

    this.uuid = uuid();
  }
}

type ArrayStateProps<T> = Omit<AngularControlProps<T>, 'validators'>;
type ArrayValidatorsProps<T> = Omit<AngularControlProps<T>, 'state'>;

export function formArrayControl<T>(): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  props: ArrayStateProps<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  props: ArrayValidatorsProps<T>
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  state: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T>;
export function formArrayControl<T>(
  props?: AngularControlProps<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T> {
  return new FormArrayControl(createFormControlProps(props, validators));
}

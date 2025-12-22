import {
  AbstractArrayGroup,
  AbstractControls,
  FormArrayGroupOptions,
  ValidatorGroupFn
} from '@rolster/forms';
import { createFormGroupOptions } from '@rolster/forms/arguments';
import { v4 as uuid } from 'uuid';
import { FormGroup } from '../form-group';
import { AngularArrayControl } from '../types';

export type FormArrayControls<
  T extends AngularArrayControl = AngularArrayControl
> = AbstractControls<T>;

type ArrayGroupOptions<T extends FormArrayControls> = Omit<
  FormArrayGroupOptions<T>,
  'uuid'
>;

export class FormArrayGroup<
    C extends FormArrayControls = FormArrayControls,
    R = any
  >
  extends FormGroup<C>
  implements AbstractArrayGroup<C>
{
  public readonly uuid: string;

  public readonly resource?: R;

  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(options: ArrayGroupOptions<C>);
  constructor(
    options: ArrayGroupOptions<C> | C,
    validators?: ValidatorGroupFn<C>[]
  ) {
    const formGroup = createFormGroupOptions<C, ArrayGroupOptions<C>>(
      options,
      validators
    );

    super(formGroup.controls, formGroup.validators);

    this.uuid = uuid();
    this.resource = formGroup.resource;
  }
}

export function formArrayGroup<C extends FormArrayControls = FormArrayControls>(
  options: ArrayGroupOptions<C>
): FormArrayGroup<C>;
export function formArrayGroup<C extends FormArrayControls = FormArrayControls>(
  controls: C,
  validators?: ValidatorGroupFn<C>[]
): FormArrayGroup<C>;
export function formArrayGroup<C extends FormArrayControls = FormArrayControls>(
  options: ArrayGroupOptions<C> | C,
  validators?: ValidatorGroupFn<C>[]
): FormArrayGroup<C> {
  return new FormArrayGroup(createFormGroupOptions(options, validators));
}

import { v4 as uuid } from 'uuid';
import { FormGroup } from '../form-group/form-group';
import { createFormGroupOptions } from '../form-group/form-group.helper';
import {
  AbstractAngularControls,
  ValidatorGroupFn
} from '../form-group/form-group.type';
import { AngularArrayControl } from './form-array-control.type';
import {
  AbstractAngularArrayGroup,
  AngularFormArrayGroupOptions
} from './form-array-group.type';

export type FormArrayControls<
  T extends AngularArrayControl = AngularArrayControl
> = AbstractAngularControls<T>;

type ArrayGroupOptions<T extends FormArrayControls> = Omit<
  AngularFormArrayGroupOptions<T>,
  'uuid'
>;

export class FormArrayGroup<
    C extends FormArrayControls = FormArrayControls,
    R = any
  >
  extends FormGroup<C>
  implements AbstractAngularArrayGroup<C>
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

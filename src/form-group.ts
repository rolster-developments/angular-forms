import {
  AbstractControls,
  FormGroup as RolsterFormGroup,
  FormGroupProps,
  ValidatorGroupFn,
  createFormGroupProps
} from '@rolster/forms';
import { AngularControl } from './types';

export type FormControls<T extends AngularControl = AngularControl> =
  AbstractControls<T>;

export class FormGroup<
  C extends FormControls = FormControls
> extends RolsterFormGroup<C> {}

export function formGroup<C extends FormControls = FormControls>(
  props: FormGroupProps<C>
): FormGroup<C>;
export function formGroup<C extends FormControls = FormControls>(
  controls: C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C>;
export function formGroup<C extends FormControls = FormControls>(
  groupProps: FormGroupProps<C> | C,
  groupValidators?: ValidatorGroupFn<C>[]
): FormGroup<C> {
  return new FormGroup(createFormGroupProps(groupProps, groupValidators));
}

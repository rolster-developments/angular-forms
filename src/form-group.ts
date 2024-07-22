import {
  AbstractControls,
  FormGroup as RolsterFormGroup,
  FormGroupOptions,
  ValidatorGroupFn,
  createFormGroupOptions
} from '@rolster/forms';
import { AngularControl } from './types';

export type FormControls<T extends AngularControl = AngularControl> =
  AbstractControls<T>;

export class FormGroup<
  C extends FormControls = FormControls
> extends RolsterFormGroup<C> {}

export function formGroup<C extends FormControls = FormControls>(
  props: FormGroupOptions<C>
): FormGroup<C>;
export function formGroup<C extends FormControls = FormControls>(
  controls: C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C>;
export function formGroup<C extends FormControls = FormControls>(
  options: FormGroupOptions<C> | C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C> {
  return new FormGroup(createFormGroupOptions(options, validators));
}

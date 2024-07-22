import {
  AbstractArrayGroup,
  AbstractControls,
  FormArray as RolsterFormArray,
  FormArrayProps,
  ValidatorArrayFn,
  createFormArrayProps
} from '@rolster/forms';
import { AngularArrayControl } from '../types';

type FormControls<T extends AngularArrayControl = AngularArrayControl> =
  AbstractControls<T>;

type ArrayProps<G extends FormControls, R> = FormArrayProps<
  G,
  R,
  AbstractArrayGroup<G, R>
>;

export class FormArray<
  G extends FormControls = FormControls,
  R = any
> extends RolsterFormArray<G, R> {}

export function formArray<
  G extends FormControls = FormControls,
  R = any
>(): FormArray<G, R>;

export function formArray<G extends FormControls = FormControls, R = any>(
  props: ArrayProps<G, R>
): FormArray<G, R>;
export function formArray<G extends FormControls = FormControls, R = any>(
  groups: AbstractArrayGroup<G, R>[],
  validators?: ValidatorArrayFn<G, R>[]
): FormArray<G, R>;
export function formArray<G extends FormControls = FormControls, R = any>(
  arrayProps?: ArrayProps<G, R> | AbstractArrayGroup<G, R>[],
  arrayValidators?: ValidatorArrayFn<G, R>[]
): FormArray<G, R> {
  return new FormArray(createFormArrayProps(arrayProps, arrayValidators));
}

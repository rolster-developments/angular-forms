import {
  AbstractArrayGroup,
  AbstractControls,
  FormArray as RolsterFormArray,
  FormArrayOptions,
  ValidatorArrayFn
} from '@rolster/forms';
import { createFormArrayOptions } from '@rolster/forms/arguments';
import { AngularArrayControl } from '../types';

type FormControls<T extends AngularArrayControl = AngularArrayControl> =
  AbstractControls<T>;

type ArrayOptions<G extends FormControls, R> = FormArrayOptions<
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
  options: ArrayOptions<G, R>
): FormArray<G, R>;
export function formArray<G extends FormControls = FormControls, R = any>(
  groups: AbstractArrayGroup<G, R>[],
  validators?: ValidatorArrayFn<G, R>[]
): FormArray<G, R>;
export function formArray<G extends FormControls = FormControls, R = any>(
  options?: ArrayOptions<G, R> | AbstractArrayGroup<G, R>[],
  validators?: ValidatorArrayFn<G, R>[]
): FormArray<G, R> {
  return new FormArray(createFormArrayOptions(options, validators));
}

import { createFormGroupOptions } from './helpers';
import {
  AbstractAngularFormGroup,
  AngularFormControls,
  AngularFormGroupOptions,
  ValidatorGroupFn
} from './types';

export class FormGroup<C extends AngularFormControls = AngularFormControls>
  implements AbstractAngularFormGroup<C>
{
  private validators?: ValidatorGroupFn<C>[];

  constructor(options: AngularFormGroupOptions<C>);
  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(
    options: AngularFormGroupOptions<C> | C,
    validators?: ValidatorGroupFn<C>[]
  ) {
    const formGroup = createFormGroupOptions(options, validators);

    this.validators = formGroup.validators;
  }
}

// export function formGroup<C extends AngularFormControls = AngularFormControls>(
//   props: FormGroupOptions<C>
// ): FormGroup<C>;
// export function formGroup<C extends AngularFormControls = AngularFormControls>(
//   controls: C,
//   validators?: ValidatorGroupFn<C>[]
// ): FormGroup<C>;
// export function formGroup<C extends AngularFormControls = AngularFormControls>(
//   options: FormGroupOptions<C> | C,
//   validators?: ValidatorGroupFn<C>[]
// ): FormGroup<C> {
//   return new FormGroup(createFormGroupOptions(options, validators));
// }

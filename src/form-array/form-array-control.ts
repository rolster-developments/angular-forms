import {
  AbstractArrayControl,
  FormArrayControlProps,
  FormState,
  createFormControlProps
} from '@rolster/helpers-forms';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { BaseFormControl } from '../implementations';
import { AngularFormArrayControls } from '../types-angular';

type AngularArrayControlProps<T> = Omit<FormArrayControlProps<T>, 'uuid'>;

export class FormArrayControl<T = any>
  extends BaseFormControl<T, AngularFormArrayControls>
  implements AbstractArrayControl<T>
{
  public readonly uuid: string;

  constructor();
  constructor(props: AngularArrayControlProps<T>);
  constructor(state: FormState<T>, validators?: ValidatorFn<T>[]);
  constructor(
    controlProps?: AngularArrayControlProps<T> | FormState<T>,
    controlValidators?: ValidatorFn<T>[]
  ) {
    const { state, validators } = createFormControlProps(
      controlProps,
      controlValidators
    );

    super(state, validators);

    this.uuid = uuid();
  }
}

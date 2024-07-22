import {
  FormArrayControlProps,
  FormState,
  createFormControlProps
} from '@rolster/forms';
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
  constructor(state: FormState<T>, validators?: ValidatorFn<T>[]);
  constructor(
    controlProps?: AngularControlProps<T> | FormState<T>,
    controlValidators?: ValidatorFn<T>[]
  ) {
    const props = createFormControlProps(controlProps, controlValidators);

    super(props);

    this.uuid = uuid();
  }
}

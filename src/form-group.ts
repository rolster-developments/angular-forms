import {
  AbstractControls,
  FormGroup as RolsterFormGroup
} from '@rolster/forms';
import { AngularControl } from './types';

export type FormControls<T extends AngularControl = AngularControl> =
  AbstractControls<T>;

export class FormGroup<
  C extends FormControls = FormControls
> extends RolsterFormGroup<C> {}

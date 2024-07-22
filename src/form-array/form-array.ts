import {
  AbstractControls,
  FormArray as RolsterFormArray
} from '@rolster/forms';
import { AngularArrayControl } from '../types';

type FormControls<T extends AngularArrayControl = AngularArrayControl> =
  AbstractControls<T>;

export class FormArray<
  G extends FormControls = FormControls,
  R = any
> extends RolsterFormArray<G, R> {}

import { BaseFormControl } from './implementations';
import { AngularFormControls } from './types-angular';

export class FormControl<T = any> extends BaseFormControl<
  T,
  AngularFormControls
> {}

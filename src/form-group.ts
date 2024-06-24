import {
  AbstractFormGroup,
  StateGroup,
  ValueGroup
} from '@rolster/helpers-forms';
import {
  controlsToState,
  controlsToValue
} from '@rolster/helpers-forms/helpers';
import { BaseFormGroup } from './implementations';
import { AngularFormControls } from './types-angular';

export type FormControls = AngularFormControls;

export class FormGroup<C extends FormControls = FormControls>
  extends BaseFormGroup<C>
  implements AbstractFormGroup<C>
{
  public get state(): StateGroup<C> {
    return controlsToState(this.currentControls);
  }

  public get value(): ValueGroup<C> {
    return controlsToValue(this.currentControls);
  }
}

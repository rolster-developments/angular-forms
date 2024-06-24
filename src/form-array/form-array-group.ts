import {
  ArrayStateGroup,
  ArrayValueGroup,
  FormArrayGroupProps,
  ValidatorGroupFn,
  createFormGroupProps
} from '@rolster/helpers-forms';
import {
  controlsToState,
  controlsToValue
} from '@rolster/helpers-forms/helpers';
import { v4 as uuid } from 'uuid';
import { BaseFormGroup } from '../implementations';
import {
  AngularFormArray,
  AngularFormArrayControls,
  AngularFormArrayGroup
} from '../types-angular';

type AngularArrayGroupProps<T extends AngularFormArrayControls> = Omit<
  FormArrayGroupProps<T>,
  'uuid'
>;

export class FormArrayGroup<
    C extends AngularFormArrayControls = AngularFormArrayControls,
    R = any
  >
  extends BaseFormGroup<C>
  implements AngularFormArrayGroup<C>
{
  public readonly uuid: string;

  public readonly resource?: R;

  private currentParent?: AngularFormArray<C>;

  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(props: AngularArrayGroupProps<C>);
  constructor(
    groupProps: AngularArrayGroupProps<C> | C,
    groupValidators?: ValidatorGroupFn<C>[]
  ) {
    const { controls, resource, validators } = createFormGroupProps<
      C,
      AngularArrayGroupProps<C>
    >(groupProps, groupValidators);

    super(controls, validators);

    this.uuid = uuid();
    this.resource = resource;
  }

  public setParent(parent: AngularFormArray<C>): void {
    this.currentParent = parent;
  }

  public updateValueAndValidity(controls?: boolean): void {
    super.updateValueAndValidity(controls);

    this.currentParent?.updateValueAndValidity(false);
  }

  public get state(): ArrayStateGroup<C> {
    return controlsToState(this.currentControls);
  }

  public get value(): ArrayValueGroup<C> {
    return controlsToValue(this.currentControls);
  }
}

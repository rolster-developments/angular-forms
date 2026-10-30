import { signal, WritableSignal } from '@angular/core';
import { ValidatorGroupFn } from '@rolster/forms';
import { createFormGroupOptions } from '@rolster/forms/helpers';
import { v4 as uuid } from 'uuid';
import { FormGroup } from '../form-group/form-group';
import {
  AngularArrayControls,
  AngularArrayGroup,
  AngularArrayGroupOptions,
  ArrayGroupSignals
} from './form-array-group.type';

export class FormArrayGroup<
    C extends AngularArrayControls = AngularArrayControls,
    R = any
  >
  extends FormGroup<C>
  implements AngularArrayGroup<C, R>
{
  public readonly uuid: string;

  private readonly resourceState: WritableSignal<R | undefined>;

  private readonly arrayGroupSignals: ArrayGroupSignals<C, R>;

  constructor(options: AngularArrayGroupOptions<C, R>);
  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(
    options: AngularArrayGroupOptions<C, R> | C,
    validators?: ValidatorGroupFn<C>[]
  ) {
    const formGroup = createFormGroupOptions<C, AngularArrayGroupOptions<C, R>>(
      options,
      validators
    );

    super(formGroup.controls, formGroup.validators);

    this.uuid = formGroup.uuid ?? uuid();
    this.resourceState = signal(formGroup.resource);

    this.arrayGroupSignals = {
      ...this.groupSignals,
      resource: this.resourceState.asReadonly()
    };
  }

  public override get signals(): ArrayGroupSignals<C, R> {
    return this.arrayGroupSignals;
  }

  public get resource(): R | undefined {
    return this.resourceState();
  }

  public setResource(resource: Undefined<R>): void {
    this.resourceState.set(resource);
  }
}

export function formArrayGroup<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
>(options: AngularArrayGroupOptions<C, R>): FormArrayGroup<C, R>;
export function formArrayGroup<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
>(controls: C, validators?: ValidatorGroupFn<C>[]): FormArrayGroup<C, R>;
export function formArrayGroup<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
>(
  options: AngularArrayGroupOptions<C, R> | C,
  validators?: ValidatorGroupFn<C>[]
): FormArrayGroup<C, R> {
  return new FormArrayGroup<C, R>(
    createFormGroupOptions<C, AngularArrayGroupOptions<C, R>>(
      options,
      validators
    )
  );
}

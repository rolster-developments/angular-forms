import { Signal } from '@angular/core';
import {
  AbstractControls,
  AbstractFormGroup,
  ControlsValue,
  ValidatorGroupFn
} from '@rolster/forms';
import { ValidatorError } from '@rolster/validators';
import { AngularAbstractControl } from '../form-control/form-control.type';

export type AngularControls<
  T extends AngularAbstractControl = AngularAbstractControl
> = AbstractControls<T>;

export interface GroupSignals<C extends AngularControls = AngularControls> {
  readonly dirties: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  readonly pristines: Signal<boolean>;
  readonly touched: Signal<boolean>;
  readonly toucheds: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly untoucheds: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly validators: Signal<ValidatorGroupFn<C>[] | undefined>;
  readonly value: Signal<ControlsValue<C>>;
  readonly wrong: Signal<boolean>;
}

export interface AngularGroup<C extends AngularControls = AngularControls>
  extends AbstractFormGroup<C> {
  readonly signal: Signal<ControlsValue<C>>;
  readonly signals: GroupSignals<C>;
  readonly validators?: ValidatorGroupFn<C>[];
}

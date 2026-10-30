import { ElementRef, Signal } from '@angular/core';
import {
  AbstractArray,
  ArrayControlsValue,
  ValidatorArrayFn
} from '@rolster/forms';
import { ValidatorError } from '@rolster/validators';
import {
  AngularArrayControls,
  AngularArrayGroup
} from './form-array-group.type';

export interface ArraySignals<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
> {
  readonly controls: Signal<C[]>;
  readonly dirties: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly enabled: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  readonly groups: Signal<G[]>;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  readonly pristines: Signal<boolean>;
  readonly touched: Signal<boolean>;
  readonly toucheds: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly untoucheds: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly validators: Signal<ValidatorArrayFn<C, R>[] | undefined>;
  readonly value: Signal<ArrayControlsValue<C>[]>;
  readonly wrong: Signal<boolean>;
}

export interface AngularFormArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
> extends AbstractArray<C, R, G> {
  readonly signal: Signal<ArrayControlsValue<C>[]>;
  readonly signals: ArraySignals<C, R, G>;
  elementRef?: ElementRef<HTMLElement>;
  readonly validators?: ValidatorArrayFn<C, R>[];
}

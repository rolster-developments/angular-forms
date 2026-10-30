import { Signal } from '@angular/core';
import {
  AbstractArrayControls,
  AbstractArrayGroup,
  ArrayControlsValue,
  FormArrayGroupOptions
} from '@rolster/forms';
import { GroupSignals } from '../form-group/form-group.type';
import { AngularArrayControl } from './form-array-control.type';

export type AngularArrayControls<
  T extends AngularArrayControl = AngularArrayControl
> = AbstractArrayControls<T>;

export interface AngularArrayGroupOptions<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
> extends Omit<FormArrayGroupOptions<C, R>, 'uuid'> {
  uuid?: string;
}

export interface ArrayGroupSignals<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
> extends GroupSignals<C> {
  readonly resource: Signal<R | undefined>;
}

export interface AngularArrayGroup<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
> extends AbstractArrayGroup<C, R> {
  reset(): void;
  setResource(resource: Undefined<R>): void;
  setValue(value: Partial<ArrayControlsValue<C>>): void;
  readonly signal: Signal<ArrayControlsValue<C>>;
  readonly signals: ArrayGroupSignals<C, R>;
}

import { Signal } from '@angular/core';
import {
  AbstractArray,
  AbstractArrayControl,
  AbstractArrayGroup,
  AbstractBaseControl,
  AbstractControls,
  AbstractGroup,
  FormState
} from '@rolster/helpers-forms';

export type AngularControls<
  T extends AbstractBaseControl = AbstractBaseControl
> = AbstractControls<T>;

export interface AngularControl<
  T = any,
  C extends AngularControls = AngularControls
> extends AbstractBaseControl<T> {
  readonly signal: Signal<FormState<T>>;
  setParent: (parent: AngularGroup<C>) => void;
  updateValueAndValidity: () => void;
}

export interface AngularGroup<T extends AngularControls = AngularControls>
  extends AbstractGroup<T> {
  updateValueAndValidity: (controls?: boolean) => void;
}

export type AngularFormControls = AngularControls<AngularControl>;
export type AngularFormControl<T = any> = AngularControl<
  T,
  AngularFormControls
>;
export type AngularFormGroup = AngularGroup<AngularFormControls>;

export interface AngularArrayControl<
  T = any,
  C extends AngularControls = AngularControls
> extends AbstractArrayControl<T> {
  readonly signal: Signal<FormState<T>>;
  setParent: (parent: AngularGroup<C>) => void;
  updateValueAndValidity: () => void;
}

export type AngularFormArrayControls = AngularControls<AngularArrayControl>;

export interface AngularFormArrayGroup<
  T extends AngularFormArrayControls = AngularFormArrayControls,
  R = any
> extends AbstractArrayGroup<T, R> {
  setParent: (parent: AngularFormArray<T>) => void;
  updateValueAndValidity: (controls?: boolean) => void;
}

export interface AngularFormArray<
  T extends AngularFormArrayControls = AngularFormArrayControls,
  R = any
> extends AbstractArray<T, R, AngularFormArrayGroup<T, R>> {
  updateValueAndValidity: (groups?: boolean) => void;
}

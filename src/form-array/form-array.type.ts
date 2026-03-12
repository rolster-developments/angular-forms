import { Signal } from '@angular/core';
import { ValidatorResult } from '@rolster/validators';
import { AbstractAngularControl } from '../form-control/form-control.type';
import {
  AbstractAngularArrayControls,
  AbstractAngularArrayGroup,
  AngularArrayControlsSignal
} from './form-array-group.type';

export type ValidatorArrayFn<
  T extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any,
  G extends AbstractAngularArrayGroup<T, R> = AbstractAngularArrayGroup<T, R>,
  V = any
> = (groups: G[]) => ValidatorResult<V>;

export interface AbstractAngularArray<
  C extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any,
  G extends AbstractAngularArrayGroup<C, R> = AbstractAngularArrayGroup<C, R>
> extends AbstractAngularControl<AngularArrayControlsSignal<C>[]> {
  readonly controls: Signal<C[]>;
  readonly dirties: Signal<boolean>;
  disable: () => void;
  enable: () => void;
  findByUuid: (uuid: string) => Undefined<G>;
  readonly groups: Signal<G[]>;
  merge: (groups: G[]) => void;
  readonly pristines: Signal<boolean>;
  push: (group: G) => void;
  remove: (group: G) => void;
  setDefaultValue: (groups: G[]) => void;
  setValue: (groups: G[]) => void;
  setValidators: (validators: ValidatorArrayFn<C, R>[]) => void;
  readonly toucheds: Signal<boolean>;
  readonly untoucheds: Signal<boolean>;
}

export interface AngularFormArrayOptions<
  C extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any,
  G extends AbstractAngularArrayGroup<C, R> = AbstractAngularArrayGroup<C, R>
> {
  groups?: G[];
  validators?: ValidatorArrayFn<C, R>[];
}

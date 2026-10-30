import { Signal } from '@angular/core';
import {
  AbstractArrayList,
  ArrayControlsValue,
  ArrayListValueToControls
} from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import {
  AngularValueSetter,
  ControlSignals
} from '../form-control/form-control.type';
import { AngularArrayControl } from './form-array-control.type';
import { AngularArrayControls } from './form-array-group.type';

export type ArrayListValueToUuid<
  C extends AngularArrayControls = AngularArrayControls
> = (value: ArrayControlsValue<C>) => string;

export interface AngularListOptions<
  C extends AngularArrayControls = AngularArrayControls
> {
  valueToControls: ArrayListValueToControls<C>;
  touched?: boolean;
  validators?: ValidatorFn<ArrayControlsValue<C>[]>[];
  value?: ArrayControlsValue<C>[];
  valueToUuid?: ArrayListValueToUuid<C>;
}

export interface ArrayListSignals<
  C extends AngularArrayControls = AngularArrayControls
> extends ControlSignals<ArrayControlsValue<C>[]> {
  readonly controls: Signal<C[]>;
  readonly controlsUuid: Signal<string[]>;
}

export interface AngularArrayList<
  C extends AngularArrayControls = AngularArrayControls,
  E extends HTMLElement = HTMLElement
> extends AngularArrayControl<ArrayControlsValue<C>[], E>,
    AbstractArrayList<C> {
  readonly controlsUuid: string[];
  findControlsByUuid(uuid: string): Undefined<C>;
  setValue: AngularValueSetter<ArrayControlsValue<C>[]>;
  readonly signals: ArrayListSignals<C>;
}

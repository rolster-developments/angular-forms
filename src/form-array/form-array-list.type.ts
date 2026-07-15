import { Signal } from '@angular/core';
import { AbstractAngularArrayControl } from './form-array-control.type';
import {
  AngularArrayControls,
  AngularArrayControlsData
} from './form-array-group.type';

export type AngularArrayListValueToControls<
  C extends AngularArrayControls = AngularArrayControls
> = (value: AngularArrayControlsData<C>) => C;

export interface AngularArrayList<
  C extends AngularArrayControls = AngularArrayControls
> extends AbstractAngularArrayControl<AngularArrayControlsData<C>[]> {
  controls: Signal<C[]>;
  push(controls: C): void;
  remove(controls: C): void;
}

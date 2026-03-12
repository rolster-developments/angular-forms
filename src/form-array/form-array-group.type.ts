import {
  AbstractAngularControls,
  AbstractAngularFormGroup,
  AngularFormGroupOptions
} from '../form-group/form-group.type';
import {
  AbstractAngularArrayControl,
  AngularArrayControl
} from './form-array-control.type';

export type AbstractAngularArrayControls<
  T extends AbstractAngularArrayControl = AbstractAngularArrayControl
> = AbstractAngularControls<T>;

export type AngularArrayControls<
  T extends AngularArrayControl = AngularArrayControl
> = AbstractAngularArrayControls<T>;

export type AngularArrayControlsSignal<C extends AbstractAngularArrayControls> =
  {
    [K in keyof C]: C[K]['value'];
  };

export type AngularArrayControlsData<C extends AbstractAngularArrayControls> = {
  [K in keyof C]: C[K]['data'];
};

export interface AngularFormArrayGroupOptions<
  C extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any
> extends AngularFormGroupOptions<C> {
  uuid: string;
  resource?: R;
}

export interface AbstractAngularArrayGroup<
  C extends AbstractAngularArrayControls,
  R = any
> extends AbstractAngularFormGroup<C> {
  readonly uuid: string;
  readonly resource?: R;
}

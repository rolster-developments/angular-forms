import { AngularFormControl } from '../form-control/form-control.type';

export interface AbstractAngularArrayControl<T = any>
  extends AngularFormControl<T> {
  readonly uuid: string;
}

export type AngularArrayControl<T = any> = AbstractAngularArrayControl<T>;

export type AngularArrayVoid<T = any> = AngularArrayControl<T | undefined>;

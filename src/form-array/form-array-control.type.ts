import { FormArrayControlOptions } from '@rolster/forms';
import {
  AngularFormControl,
  AngularFormVoid
} from '../form-control/form-control.type';

export interface AngularArrayControlOptions<T = any>
  extends Omit<FormArrayControlOptions<T>, 'uuid'> {
  touched?: boolean;
  uuid?: string;
}

export interface AngularArrayControl<
  T = any,
  E extends HTMLElement = HTMLElement
> extends AngularFormControl<T, E> {
  readonly uuid: string;
}

export interface AngularArrayVoid<T = any, E extends HTMLElement = HTMLElement>
  extends AngularFormVoid<T, E> {
  readonly uuid: string;
}

export type AngularHtmlArrayControl<T = any> = AngularArrayControl<
  T,
  HTMLElement
>;
export type AngularHtmlArrayVoid<T = any> = AngularArrayVoid<T, HTMLElement>;
export type AngularInputArrayControl<T = any> = AngularArrayControl<
  T,
  HTMLInputElement
>;
export type AngularAreaArrayControl = AngularArrayControl<
  string,
  HTMLTextAreaElement
>;
export type AngularInputArrayVoid<T = any> = AngularArrayVoid<
  T,
  HTMLInputElement
>;
export type AngularAreaArrayVoid = AngularArrayVoid<
  string,
  HTMLTextAreaElement
>;

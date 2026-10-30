import { ElementRef, Signal } from '@angular/core';
import { AbstractFormControl, AbstractValueControl } from '@rolster/forms';
import { ValidatorError, ValidatorFn } from '@rolster/validators';

export interface ControlSignals<T = any> {
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly enabled: Signal<boolean>;
  readonly error: Signal<ValidatorError | undefined>;
  readonly errors: Signal<ValidatorError[]>;
  readonly focused: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  readonly pristine: Signal<boolean>;
  readonly touched: Signal<boolean>;
  readonly unfocused: Signal<boolean>;
  readonly untouched: Signal<boolean>;
  readonly valid: Signal<boolean>;
  readonly validators: Signal<ValidatorFn<T>[] | undefined>;
  readonly value: Signal<T>;
  readonly wrong: Signal<boolean>;
}

export type ValueSetter<T> = (current: T) => T;

export type AngularValueSetter<T> = (value: T | ValueSetter<T>) => void;

export interface AngularAbstractControl<
  T = any,
  E extends HTMLElement = HTMLElement
> extends AbstractValueControl<T> {
  readonly signal: Signal<T>;
  elementRef?: ElementRef<E>;
}

export interface AngularFormControl<
  T = any,
  E extends HTMLElement = HTMLElement
> extends AbstractFormControl<T> {
  setValue: AngularValueSetter<T>;
  readonly signal: Signal<T>;
  readonly signals: ControlSignals<T>;
  elementRef?: ElementRef<E>;
  readonly validators?: ValidatorFn<T>[];
}

export type AngularFormVoid<
  T = any,
  E extends HTMLElement = HTMLElement
> = AngularFormControl<T | undefined, E>;

export type AngularHtmlControl<T = any> = AngularFormControl<T, HTMLElement>;
export type AngularHtmlVoid<T = any> = AngularFormVoid<T, HTMLElement>;
export type AngularInputControl<T = any> = AngularFormControl<
  T,
  HTMLInputElement
>;
export type AngularAreaControl = AngularFormControl<
  string,
  HTMLTextAreaElement
>;
export type AngularInputVoid<T = any> = AngularFormVoid<T, HTMLInputElement>;
export type AngularAreaVoid = AngularFormVoid<string, HTMLTextAreaElement>;

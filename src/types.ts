import { Signal } from '@angular/core';
import {
  AbstractArrayControl,
  AbstractControl,
  FormState
} from '@rolster/forms';

export interface AngularControl<T = any> extends AbstractControl<T> {
  readonly signal: Signal<FormState<T>>;
}

export interface AngularArrayControl<T = any> extends AbstractArrayControl<T> {
  readonly signal: Signal<FormState<T>>;
}

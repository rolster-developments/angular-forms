import { Signal } from '@angular/core';
import { AbstractArrayControl, AbstractControl } from '@rolster/forms';

export interface AngularControl<T = any> extends AbstractControl<T> {
  readonly signal: Signal<T>;
}

export interface AngularArrayControl<T = any> extends AbstractArrayControl<T> {
  readonly signal: Signal<T>;
}

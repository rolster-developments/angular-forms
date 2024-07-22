import { Signal } from '@angular/core';
import { AbstractArrayControl, AbstractReactiveControl } from '@rolster/forms';

export interface AngularControl<T = any> extends AbstractReactiveControl<T> {
  readonly signal: Signal<T>;
}

export interface AngularArrayControl<T = any> extends AbstractArrayControl<T> {
  readonly signal: Signal<T>;
}

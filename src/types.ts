import { Signal } from '@angular/core';
import {
  AbstractReactiveArrayControl,
  AbstractReactiveControl
} from '@rolster/forms';

export interface AngularControl<T = any> extends AbstractReactiveControl<T> {
  readonly signal: Signal<T>;
}

export interface AngularArrayControl<T = any>
  extends AbstractReactiveArrayControl<T> {
  readonly signal: Signal<T>;
}

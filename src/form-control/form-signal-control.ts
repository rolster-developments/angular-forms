import { effect, Signal } from '@angular/core';
import { controlIsValid, hasError, someErrors } from '@rolster/forms/helpers';
import { ValidatorError, ValidatorFn } from '@rolster/validators';
import { setValueInSignal } from './form-control.helper';
import { AngularControl } from './form-control.type';

export interface SignalControlOptions<T = any> {
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
  readonly value: Signal<T>;
  readonly wrong: Signal<boolean>;
}

export class FormSignalControl<T = any> implements AngularControl<T> {
  protected constructor(
    protected defaultValue: T,
    protected readonly signals: SignalControlOptions<T>,
    protected validators?: ValidatorFn<T>[]
  ) {
    effect(() => {
      this.refreshValidity(this.signals.value(), this.validators);
    });
  }

  public get focused(): Signal<boolean> {
    return this.signals.focused;
  }

  public get unfocused(): Signal<boolean> {
    return this.signals.unfocused;
  }

  public get touched(): Signal<boolean> {
    return this.signals.touched;
  }

  public get untouched(): Signal<boolean> {
    return this.signals.untouched;
  }

  public get dirty(): Signal<boolean> {
    return this.signals.dirty;
  }

  public get pristine(): Signal<boolean> {
    return this.signals.pristine;
  }

  public get disabled(): Signal<boolean> {
    return this.signals.disabled;
  }

  public get enabled(): Signal<boolean> {
    return this.signals.enabled;
  }

  public get valid(): Signal<boolean> {
    return this.signals.valid;
  }

  public get invalid(): Signal<boolean> {
    return this.signals.invalid;
  }

  public get value(): Signal<T> {
    return this.signals.value;
  }

  public get data(): T {
    return this.signals.value();
  }

  public get errors(): Signal<ValidatorError[]> {
    return this.signals.errors;
  }

  public get error(): Signal<ValidatorError | undefined> {
    return this.signals.error;
  }

  public get wrong(): Signal<boolean> {
    return this.signals.wrong;
  }

  public hasError(key: string): boolean {
    return hasError(this.errors(), key);
  }

  public someErrors(keys: string[]): boolean {
    return someErrors(this.errors(), keys);
  }

  public reset(): void {
    setValueInSignal(this.signals.touched, false);
    setValueInSignal(this.signals.dirty, true);
    setValueInSignal(this.signals.value, this.defaultValue);
  }

  public focus(): void {
    setValueInSignal(this.signals.focused, true);
  }

  public blur(): void {
    setValueInSignal(this.signals.focused, false);
    setValueInSignal(this.signals.touched, true);
  }

  public disable(): void {
    setValueInSignal(this.signals.disabled, true);
  }

  public enable(): void {
    setValueInSignal(this.signals.disabled, false);
  }

  public touch(): void {
    setValueInSignal(this.signals.touched, true);
  }

  public setDefaultValue(value: T): void {
    this.defaultValue = value;
    setValueInSignal(this.signals.value, value);
  }

  public setStartValue(value: T): void {
    setValueInSignal(this.signals.value, value);
  }

  public setValue(value: T): void {
    setValueInSignal(this.signals.dirty, true);
    setValueInSignal(this.signals.value, value);
  }

  public setValidators(validators: ValidatorFn<T>[] = []): void {
    this.validators = validators;
    this.refreshValidity(this.value(), validators);
  }

  protected refreshValidity(value: T, validators?: ValidatorFn<T>[]): void {
    if (validators) {
      const errors = controlIsValid({ value, validators });

      setValueInSignal(this.signals.valid, errors.length === 0);
      setValueInSignal(this.signals.errors, errors);
    } else {
      setValueInSignal(this.signals.valid, true);
      setValueInSignal(this.signals.errors, []);
    }
  }
}

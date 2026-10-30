import { computed, ElementRef, Signal, WritableSignal } from '@angular/core';
import { FormatOn, FormatterFn, FormatterOptions } from '@rolster/forms';
import {
  formatBlurValue,
  formatInputValue,
  formControlIsValid,
  hasError,
  someErrors
} from '@rolster/forms/helpers';
import { ValidatorError, ValidatorFn } from '@rolster/validators';
import {
  AngularFormControl,
  ControlSignals,
  ValueSetter
} from './form-control.type';

export interface SignalControlState<T = any> {
  readonly dirty: WritableSignal<boolean>;
  readonly disabled: WritableSignal<boolean>;
  readonly focused: WritableSignal<boolean>;
  readonly touched: WritableSignal<boolean>;
  readonly validators: WritableSignal<ValidatorFn<T>[] | undefined>;
  readonly value: Signal<T>;
  readonly errors?: Signal<ValidatorError[]>;
  readonly valid?: Signal<boolean>;
}

function valueIsSetter<T>(value: T | ValueSetter<T>): value is ValueSetter<T> {
  return typeof value === 'function';
}

export abstract class FormSignalControl<
  T = any,
  E extends HTMLElement = HTMLElement
> implements AngularFormControl<T, E>
{
  public readonly formatter?: FormatterFn<T>;

  public readonly formatOn?: FormatOn;

  public elementRef?: ElementRef<E>;

  protected controlSignals: ControlSignals<T>;

  protected constructor(
    protected defaultValue: T,
    protected readonly state: SignalControlState<T>,
    format: FormatterOptions<T> = {}
  ) {
    this.formatter = format.formatter;
    this.formatOn = format.formatOn;

    const errors =
      state.errors ??
      computed(() => {
        const validators = state.validators();
        const value = state.value();

        return validators ? formControlIsValid({ value, validators }) : [];
      });

    const valid = state.valid ?? computed(() => errors().length === 0);

    this.controlSignals = {
      dirty: state.dirty.asReadonly(),
      disabled: state.disabled.asReadonly(),
      enabled: computed(() => !state.disabled()),
      error: computed(() => errors()[0]),
      errors,
      focused: state.focused.asReadonly(),
      invalid: computed(() => !valid()),
      pristine: computed(() => !state.dirty()),
      touched: state.touched.asReadonly(),
      unfocused: computed(() => !state.focused()),
      untouched: computed(() => !state.touched()),
      valid,
      validators: state.validators.asReadonly(),
      value: state.value,
      wrong: computed(() => state.touched() && !valid())
    };
  }

  public get signals(): ControlSignals<T> {
    return this.controlSignals;
  }

  public get signal(): Signal<T> {
    return this.controlSignals.value;
  }

  public get value(): T {
    return this.controlSignals.value();
  }

  public get validators(): ValidatorFn<T>[] | undefined {
    return this.controlSignals.validators();
  }

  public get focused(): boolean {
    return this.controlSignals.focused();
  }

  public get unfocused(): boolean {
    return this.controlSignals.unfocused();
  }

  public get touched(): boolean {
    return this.controlSignals.touched();
  }

  public get untouched(): boolean {
    return this.controlSignals.untouched();
  }

  public get dirty(): boolean {
    return this.controlSignals.dirty();
  }

  public get pristine(): boolean {
    return this.controlSignals.pristine();
  }

  public get disabled(): boolean {
    return this.controlSignals.disabled();
  }

  public get enabled(): boolean {
    return this.controlSignals.enabled();
  }

  public get valid(): boolean {
    return this.controlSignals.valid();
  }

  public get invalid(): boolean {
    return this.controlSignals.invalid();
  }

  public get errors(): ValidatorError[] {
    return this.controlSignals.errors();
  }

  public get error(): ValidatorError | undefined {
    return this.controlSignals.error();
  }

  public get wrong(): boolean {
    return this.controlSignals.wrong();
  }

  public hasError(key: string): boolean {
    return hasError(this.errors, key);
  }

  public someErrors(keys: string[]): boolean {
    return someErrors(this.errors, keys);
  }

  public reset(): void {
    this.state.dirty.set(false);
    this.state.touched.set(false);
    this.writeValue(this.defaultValue);
  }

  public focus(): void {
    this.state.focused.set(true);
  }

  public blur(): void {
    this.state.focused.set(false);
    this.state.touched.set(true);

    const value = formatBlurValue(this.value, this);

    if (!Object.is(value, this.value)) {
      this.writeValue(value);
    }
  }

  public disable(): void {
    this.state.disabled.set(true);
  }

  public enable(): void {
    this.state.disabled.set(false);
  }

  public touch(): void {
    this.state.touched.set(true);
  }

  public setDefaultValue(value: T): void {
    this.defaultValue = formatInputValue(value, this);
    this.writeValue(this.defaultValue);
  }

  public setStartValue(value: T): void {
    this.writeValue(formatInputValue(value, this));
  }

  public setValue(value: T | ValueSetter<T>): void {
    const current = this.value;
    const next = formatInputValue(
      valueIsSetter(value) ? value(current) : value,
      this
    );

    if (Object.is(next, current)) {
      return;
    }

    this.state.dirty.set(true);
    this.writeValue(next);
  }

  public setValidators(validators?: ValidatorFn<T>[]): void {
    this.state.validators.set(validators);
  }

  protected abstract writeValue(value: T): void;
}

import { computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  ControlsValue,
  FormGroupOptions,
  ValidatorGroupFn
} from '@rolster/forms';
import {
  controlsToValue,
  createFormGroupOptions,
  formGroupIsValid,
  verifyAllTrueInControls,
  verifyAnyTrueInControls
} from '@rolster/forms/helpers';
import { ValidatorError } from '@rolster/validators';
import { AngularControls, AngularGroup, GroupSignals } from './form-group.type';

export class FormGroup<C extends AngularControls = AngularControls>
  implements AngularGroup<C>
{
  private readonly validatorsState: WritableSignal<
    ValidatorGroupFn<C>[] | undefined
  >;

  protected readonly controlsState: C;

  protected groupSignals: GroupSignals<C>;

  constructor(options: FormGroupOptions<C>);
  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(
    options: FormGroupOptions<C> | C,
    validators?: ValidatorGroupFn<C>[]
  ) {
    const formGroup = createFormGroupOptions<C, FormGroupOptions<C>>(
      options,
      validators
    );

    this.controlsState = formGroup.controls;
    this.validatorsState = signal(formGroup.validators);

    const value = computed(() => controlsToValue<C>(this.controlsState));

    const dirty = computed(() =>
      verifyAnyTrueInControls(this.controlsState, 'dirty')
    );

    const dirties = computed(() =>
      verifyAllTrueInControls(this.controlsState, 'dirty')
    );

    const touched = computed(() =>
      verifyAnyTrueInControls(this.controlsState, 'touched')
    );

    const toucheds = computed(() =>
      verifyAllTrueInControls(this.controlsState, 'touched')
    );

    const validControls = computed(() =>
      verifyAllTrueInControls(this.controlsState, 'valid')
    );

    const errors = computed(() => {
      value();

      const validators = this.validatorsState();

      return validators
        ? formGroupIsValid({ controls: this.controlsState, validators })
        : [];
    });

    const valid = computed(() => errors().length === 0 && validControls());

    this.groupSignals = {
      dirties,
      dirty,
      error: computed(() => errors()[0]),
      errors,
      invalid: computed(() => !valid()),
      pristine: computed(() => !dirty()),
      pristines: computed(() => !dirties()),
      touched,
      toucheds,
      untouched: computed(() => !touched()),
      untoucheds: computed(() => !toucheds()),
      valid,
      validators: this.validatorsState.asReadonly(),
      value,
      wrong: computed(() => touched() && !valid())
    };
  }

  public get signals(): GroupSignals<C> {
    return this.groupSignals;
  }

  public get signal(): Signal<ControlsValue<C>> {
    return this.groupSignals.value;
  }

  public get controls(): C {
    return this.controlsState;
  }

  public get value(): ControlsValue<C> {
    return this.groupSignals.value();
  }

  public get validators(): ValidatorGroupFn<C>[] | undefined {
    return this.groupSignals.validators();
  }

  public get dirty(): boolean {
    return this.groupSignals.dirty();
  }

  public get dirties(): boolean {
    return this.groupSignals.dirties();
  }

  public get pristine(): boolean {
    return this.groupSignals.pristine();
  }

  public get pristines(): boolean {
    return this.groupSignals.pristines();
  }

  public get touched(): boolean {
    return this.groupSignals.touched();
  }

  public get toucheds(): boolean {
    return this.groupSignals.toucheds();
  }

  public get untouched(): boolean {
    return this.groupSignals.untouched();
  }

  public get untoucheds(): boolean {
    return this.groupSignals.untoucheds();
  }

  public get valid(): boolean {
    return this.groupSignals.valid();
  }

  public get invalid(): boolean {
    return this.groupSignals.invalid();
  }

  public get errors(): ValidatorError[] {
    return this.groupSignals.errors();
  }

  public get error(): ValidatorError | undefined {
    return this.groupSignals.error();
  }

  public get wrong(): boolean {
    return this.groupSignals.wrong();
  }

  public setValue(value: Partial<ControlsValue<C>>): void {
    Object.entries(value).forEach(([key, valueControl]) => {
      this.controlsState[key as keyof C]?.setValue(valueControl);
    });
  }

  public setValidators(validators?: ValidatorGroupFn<C>[]): void {
    this.validatorsState.set(validators);
  }

  public reset(): void {
    Object.values(this.controlsState).forEach((control) => {
      control.reset();
    });
  }
}

export function formGroup<C extends AngularControls = AngularControls>(
  options: FormGroupOptions<C>
): FormGroup<C>;
export function formGroup<C extends AngularControls = AngularControls>(
  controls: C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C>;
export function formGroup<C extends AngularControls = AngularControls>(
  options: FormGroupOptions<C> | C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C> {
  return new FormGroup(
    createFormGroupOptions<C, FormGroupOptions<C>>(options, validators)
  );
}

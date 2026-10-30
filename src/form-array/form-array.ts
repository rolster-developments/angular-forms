import {
  computed,
  ElementRef,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {
  ArrayControlsValue,
  FormArrayOptions,
  ValidatorArrayFn
} from '@rolster/forms';
import {
  controlsToValue,
  createFormArrayOptions,
  formArrayIsValid,
  hasError,
  someErrors,
  verifyAllTrueInGroups,
  verifyAnyTrueInGroups
} from '@rolster/forms/helpers';
import { ValidatorError } from '@rolster/validators';
import { AngularFormArray, ArraySignals } from './form-array.type';
import {
  AngularArrayControls,
  AngularArrayGroup
} from './form-array-group.type';

export class FormArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
> implements AngularFormArray<C, R, G>
{
  public elementRef?: ElementRef<HTMLElement>;

  public readonly signals: ArraySignals<C, R, G>;

  private defaultGroups: G[];

  private readonly groupsState: WritableSignal<G[]>;

  private readonly disabledState: WritableSignal<boolean>;

  private readonly validatorsState: WritableSignal<
    ValidatorArrayFn<C, R>[] | undefined
  >;

  private readonly groupsMap: Signal<Map<string, G>>;

  constructor();
  constructor(options: FormArrayOptions<C, R, G>);
  constructor(groups: G[], validators?: ValidatorArrayFn<C, R>[]);
  constructor(
    options?: FormArrayOptions<C, R, G> | G[],
    validators?: ValidatorArrayFn<C, R>[]
  ) {
    const formArray = createFormArrayOptions<
      C,
      R,
      G,
      FormArrayOptions<C, R, G>
    >(options, validators);

    this.defaultGroups = formArray.groups ?? [];
    this.groupsState = signal(this.defaultGroups);
    this.disabledState = signal(false);
    this.validatorsState = signal(formArray.validators);

    this.groupsMap = computed(
      () => new Map(this.groupsState().map((group) => [group.uuid, group]))
    );

    const groups = this.groupsState.asReadonly();

    const value = computed(() =>
      groups().map(({ controls }) => controlsToValue<C>(controls))
    );

    const dirty = computed(() => verifyAnyTrueInGroups(groups(), 'dirty'));
    const dirties = computed(() => verifyAllTrueInGroups(groups(), 'dirties'));
    const touched = computed(() => verifyAnyTrueInGroups(groups(), 'touched'));
    const toucheds = computed(() =>
      verifyAllTrueInGroups(groups(), 'toucheds')
    );
    const validGroups = computed(() =>
      verifyAllTrueInGroups(groups(), 'valid')
    );

    const errors = computed(() => {
      const validators = this.validatorsState();

      return validators
        ? formArrayIsValid({ groups: groups(), validators })
        : [];
    });

    const valid = computed(() => errors().length === 0 && validGroups());

    this.signals = {
      controls: computed(() => groups().map(({ controls }) => controls)),
      dirties,
      dirty,
      disabled: this.disabledState.asReadonly(),
      enabled: computed(() => !this.disabledState()),
      error: computed(() => errors()[0]),
      errors,
      groups,
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

  public get signal(): Signal<ArrayControlsValue<C>[]> {
    return this.signals.value;
  }

  public get value(): ArrayControlsValue<C>[] {
    return this.signals.value();
  }

  public get groups(): G[] {
    return this.signals.groups();
  }

  public get controls(): C[] {
    return this.signals.controls();
  }

  public get validators(): ValidatorArrayFn<C, R>[] | undefined {
    return this.signals.validators();
  }

  public get dirty(): boolean {
    return this.signals.dirty();
  }

  public get dirties(): boolean {
    return this.signals.dirties();
  }

  public get pristine(): boolean {
    return this.signals.pristine();
  }

  public get pristines(): boolean {
    return this.signals.pristines();
  }

  public get touched(): boolean {
    return this.signals.touched();
  }

  public get toucheds(): boolean {
    return this.signals.toucheds();
  }

  public get untouched(): boolean {
    return this.signals.untouched();
  }

  public get untoucheds(): boolean {
    return this.signals.untoucheds();
  }

  public get disabled(): boolean {
    return this.signals.disabled();
  }

  public get enabled(): boolean {
    return this.signals.enabled();
  }

  public get valid(): boolean {
    return this.signals.valid();
  }

  public get invalid(): boolean {
    return this.signals.invalid();
  }

  public get errors(): ValidatorError[] {
    return this.signals.errors();
  }

  public get error(): ValidatorError | undefined {
    return this.signals.error();
  }

  public get wrong(): boolean {
    return this.signals.wrong();
  }

  public hasError(key: string): boolean {
    return hasError(this.errors, key);
  }

  public someErrors(keys: string[]): boolean {
    return someErrors(this.errors, keys);
  }

  public disable(): void {
    this.disabledState.set(true);
  }

  public enable(): void {
    this.disabledState.set(false);
  }

  public setDefaultValue(groups: G[]): void {
    this.defaultGroups = groups;
    this.groupsState.set(groups);
  }

  public setStartValue(groups: G[]): void {
    this.groupsState.set(groups);
  }

  public setValue(groups: G[]): void {
    this.groupsState.set(groups);
  }

  public findByUuid(uuid: string): Undefined<G> {
    return this.groupsMap().get(uuid);
  }

  public push(group: G): void {
    this.groupsState.update((groups) => [...groups, group]);
  }

  public merge(groups: G[]): void {
    this.groupsState.update((current) => [...current, ...groups]);
  }

  public remove({ uuid }: G): void {
    this.groupsState.update((groups) =>
      groups.filter((group) => group.uuid !== uuid)
    );
  }

  public setValidators(validators?: ValidatorArrayFn<C, R>[]): void {
    this.validatorsState.set(validators);
  }

  public reset(): void {
    this.groupsState.set(this.defaultGroups);
    this.defaultGroups.forEach((group) => group.reset());
  }
}

export function formArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
>(): FormArray<C, R>;
export function formArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
>(options: FormArrayOptions<C, R, G>): FormArray<C, R, G>;
export function formArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any
>(
  groups: AngularArrayGroup<C, R>[],
  validators?: ValidatorArrayFn<C, R>[]
): FormArray<C, R>;
export function formArray<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
>(
  options?: FormArrayOptions<C, R, G> | AngularArrayGroup<C, R>[],
  validators?: ValidatorArrayFn<C, R>[]
): FormArray<C, R, G> {
  return new FormArray<C, R, G>(
    createFormArrayOptions<C, R, G, FormArrayOptions<C, R, G>>(
      options as FormArrayOptions<C, R, G> | G[],
      validators
    )
  );
}

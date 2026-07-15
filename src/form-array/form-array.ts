import {
  computed,
  effect,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { hasError, someErrors } from '@rolster/forms/helpers';
import { ValidatorError } from '@rolster/validators';
import {
  createFormArrayOptions,
  formArrayIsValid,
  verifyAllTrueInGroup,
  verifyAnyTrueInGroup
} from './form-array.helper';
import {
  AbstractAngularArray,
  AngularFormArrayOptions,
  ValidatorArrayFn
} from './form-array.type';
import { AngularArrayControl } from './form-array-control.type';
import {
  AbstractAngularArrayControls,
  AbstractAngularArrayGroup,
  AngularArrayControlsSignal
} from './form-array-group.type';

type FormArrayControls<T extends AngularArrayControl = AngularArrayControl> =
  AbstractAngularArrayControls<T>;

export class FormArray<C extends FormArrayControls = FormArrayControls, R = any>
  implements AbstractAngularArray<C, R>
{
  private defaultValue?: AbstractAngularArrayGroup<C, R>[];

  private validators: WritableSignal<ValidatorArrayFn<C, R>[] | undefined>;

  private map: Map<string, AbstractAngularArrayGroup<C, R>>;

  private groups$: WritableSignal<AbstractAngularArrayGroup<C, R>[]>;

  private validArray: Signal<boolean>;

  private validGroups: Signal<boolean>;

  private disabled$: WritableSignal<boolean>;

  public readonly controls: Signal<C[]>;

  public readonly value: Signal<AngularArrayControlsSignal<C>[]>;

  public readonly enabled: Signal<boolean>;

  public readonly dirty: Signal<boolean>;

  public readonly dirties: Signal<boolean>;

  public readonly pristine: Signal<boolean>;

  public readonly pristines: Signal<boolean>;

  public readonly touched: Signal<boolean>;

  public readonly untouched: Signal<boolean>;

  public readonly toucheds: Signal<boolean>;

  public readonly untoucheds: Signal<boolean>;

  public readonly valid: Signal<boolean>;

  public readonly invalid: Signal<boolean>;

  public readonly errors: Signal<ValidatorError[]>;

  public readonly error: Signal<ValidatorError | undefined>;

  public readonly wrong: Signal<boolean>;

  constructor();
  constructor(options: ArrayOptions<C, R>);
  constructor(
    groups: AbstractAngularArrayGroup<C, R>[],
    validators?: ValidatorArrayFn<C, R>[]
  );
  constructor(
    options?: ArrayOptions<C, R> | AbstractAngularArrayGroup<C, R>[],
    validators?: ValidatorArrayFn<C, R>[]
  ) {
    const formArray = createFormArrayOptions(options, validators);

    this.defaultValue = formArray.groups;
    this.validators = signal(formArray.validators);

    this.map = new Map();
    this.groups$ = signal(formArray.groups || []);

    this.controls = computed(() => {
      return this.groups$().map(({ controls }) => controls);
    });

    this.value = computed(() => this.groups$().map(({ value }) => value()));

    this.disabled$ = signal(false);

    this.enabled = computed(() => !this.disabled$());

    this.dirty = computed(() => verifyAnyTrueInGroup(this.groups$(), 'dirty'));

    this.pristine = computed(() => !this.dirty());

    this.dirties = computed(() =>
      verifyAllTrueInGroup(this.groups$(), 'dirty')
    );

    this.pristines = computed(() => !this.dirties());

    this.touched = computed(() =>
      verifyAnyTrueInGroup(this.groups$(), 'touched')
    );

    this.untouched = computed(() => !this.touched());

    this.toucheds = computed(() =>
      verifyAllTrueInGroup(this.groups$(), 'touched')
    );

    this.untoucheds = computed(() => !this.toucheds());

    this.validGroups = computed(() =>
      verifyAllTrueInGroup(this.groups$(), 'valid')
    );

    this.errors = computed(() => {
      const validators = this.validators();
      const groups = this.groups$();

      return validators ? formArrayIsValid({ groups, validators }) : [];
    });

    this.validArray = computed(() => this.errors().length === 0);

    this.error = computed(() => this.errors()[0]);

    this.valid = computed(() => this.validArray() && this.validGroups());

    this.invalid = computed(() => !this.valid());

    this.wrong = computed(() => this.touched() && this.invalid());

    effect(() => {
      const values = this.groups$();

      this.map.clear();

      values.forEach((group) => {
        this.map.set(group.uuid, group);
      });
    });
  }

  public get groups(): Signal<AbstractAngularArrayGroup<C, R>[]> {
    return this.groups$;
  }

  public get data(): AngularArrayControlsSignal<C>[] {
    return this.value();
  }

  public get disabled(): Signal<boolean> {
    return this.disabled$;
  }

  public disable(): void {
    this.disabled$.set(true);
  }

  public enable(): void {
    this.disabled$.set(false);
  }

  public setDefaultValue(groups: AbstractAngularArrayGroup<C, R>[]): void {
    this.defaultValue = groups;
    this.setValue(groups);
  }

  public setStartValue(groups: AbstractAngularArrayGroup<C, R>[]): void {
    this.groups$.set(groups);
  }

  public setValue(groups: AbstractAngularArrayGroup<C, R>[]): void {
    this.groups$.set(groups);
  }

  public hasError(key: string): boolean {
    return hasError(this.errors(), key);
  }

  public someErrors(keys: string[]): boolean {
    return someErrors(this.errors(), keys);
  }

  public findByUuid(uuid: string): Undefined<AbstractAngularArrayGroup<C, R>> {
    return this.map.get(uuid);
  }

  public push(group: AbstractAngularArrayGroup<C, R>): void {
    this.groups$.set([...this.groups$(), group]);
  }

  public merge(groups: AbstractAngularArrayGroup<C, R>[]): void {
    this.groups$.set([...this.groups$(), ...groups]);
  }

  public remove(group: AbstractAngularArrayGroup<C, R>): void {
    this.groups$.set(this.groups$().filter(({ uuid }) => uuid !== group.uuid));
  }

  public setValidators(validators: ValidatorArrayFn<C, R>[]): void {
    this.validators.set(validators);
  }

  public reset(): void {
    this.groups$.set(this.defaultValue || []);
  }
}

type ArrayOptions<C extends FormArrayControls, R> = AngularFormArrayOptions<
  C,
  R,
  AbstractAngularArrayGroup<C, R>
>;

export function formArray<
  C extends FormArrayControls = FormArrayControls,
  R = any
>(): FormArray<C, R>;
export function formArray<
  C extends FormArrayControls = FormArrayControls,
  R = any
>(options: ArrayOptions<C, R>): FormArray<C, R>;
export function formArray<
  C extends FormArrayControls = FormArrayControls,
  R = any
>(
  groups: AbstractAngularArrayGroup<C, R>[],
  validators?: ValidatorArrayFn<C, R>[]
): FormArray<C, R>;
export function formArray<
  C extends FormArrayControls = FormArrayControls,
  R = any
>(
  options?: ArrayOptions<C, R> | AbstractAngularArrayGroup<C, R>[],
  validators?: ValidatorArrayFn<C, R>[]
): FormArray<C, R> {
  return new FormArray(createFormArrayOptions(options, validators));
}

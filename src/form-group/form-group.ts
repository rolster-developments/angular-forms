import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { ValidatorError } from '@rolster/validators';
import {
  controlsToValue,
  createFormGroupOptions,
  formGroupIsValid,
  verifyAllTrueInControls,
  verifyAnyTrueInControls
} from './form-group.helper';
import {
  AbstractAngularFormGroup,
  AngularControlsValue,
  AngularFormControls,
  AngularFormGroupOptions,
  ValidatorGroupFn
} from './form-group.type';

export class FormGroup<C extends AngularFormControls = AngularFormControls>
  implements AbstractAngularFormGroup<C>
{
  private validGroup: Signal<boolean>;

  private validControls: Signal<boolean>;

  private validators: WritableSignal<ValidatorGroupFn<C>[] | undefined>;

  protected _controls: C;

  public readonly value: Signal<AngularControlsValue<C>>;

  public readonly dirty: Signal<boolean>;

  public readonly dirties: Signal<boolean>;

  public readonly pristine: Signal<boolean>;

  public readonly pristines: Signal<boolean>;

  public readonly touched: Signal<boolean>;

  public readonly toucheds: Signal<boolean>;

  public readonly untouched: Signal<boolean>;

  public readonly untoucheds: Signal<boolean>;

  public readonly valid: Signal<boolean>;

  public readonly invalid: Signal<boolean>;

  public readonly errors: Signal<ValidatorError[]>;

  public readonly error: Signal<ValidatorError | undefined>;

  public readonly wrong: Signal<boolean>;

  constructor(options: AngularFormGroupOptions<C>);
  constructor(controls: C, validators?: ValidatorGroupFn<C>[]);
  constructor(
    options: AngularFormGroupOptions<C> | C,
    validators?: ValidatorGroupFn<C>[]
  ) {
    const formGroup = createFormGroupOptions(options, validators);

    this._controls = formGroup.controls;
    this.validators = signal(formGroup.validators);

    this.value = computed(() => controlsToValue(this.controls));

    this.dirty = computed(() =>
      verifyAnyTrueInControls(this._controls, 'dirty')
    );

    this.pristine = computed(() => !this.dirty());

    this.dirties = computed(() =>
      verifyAllTrueInControls(this._controls, 'dirty')
    );

    this.pristines = computed(() => !this.dirties());

    this.touched = computed(() =>
      verifyAnyTrueInControls(this._controls, 'touched')
    );

    this.untouched = computed(() => !this.touched());

    this.toucheds = computed(() =>
      verifyAllTrueInControls(this._controls, 'touched')
    );

    this.untoucheds = computed(() => !this.toucheds());

    this.validControls = computed(() =>
      verifyAllTrueInControls(this._controls, 'valid')
    );

    this.errors = computed(() => {
      this.value();
      const validators = this.validators();

      return validators
        ? formGroupIsValid({ controls: this.controls, validators })
        : [];
    });

    this.validGroup = computed(() => this.errors().length === 0);

    this.error = computed(() => this.errors()[0]);

    this.valid = computed(() => this.validGroup() && this.validControls());

    this.invalid = computed(() => !this.valid());

    this.wrong = computed(() => this.touched() && this.invalid());
  }

  public get controls(): C {
    return this._controls;
  }

  public get data(): AngularControlsValue<C> {
    return this.value();
  }

  public setValue(value: Partial<AngularControlsValue<C>>): void {
    Object.entries(value).forEach(([key, valueControl]) => {
      const formControl = this._controls[key as keyof C];

      formControl?.setValue(valueControl);
    });
  }

  public reset(): void {
    Object.values(this.controls).forEach((control) => {
      control.reset();
    });
  }

  public setValidators(validators: ValidatorGroupFn<C>[]): void {
    this.validators.set(validators);
  }
}

export function formGroup<C extends AngularFormControls = AngularFormControls>(
  options: AngularFormGroupOptions<C>
): FormGroup<C>;
export function formGroup<C extends AngularFormControls = AngularFormControls>(
  controls: C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C>;
export function formGroup<C extends AngularFormControls = AngularFormControls>(
  options: AngularFormGroupOptions<C> | C,
  validators?: ValidatorGroupFn<C>[]
): FormGroup<C> {
  return new FormGroup(createFormGroupOptions(options, validators));
}

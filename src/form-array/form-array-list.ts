import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { formControlIsValid } from '@rolster/forms/helpers';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormSignalControl } from '../form-control/form-signal-control';
import {
  AngularArrayControls,
  AngularArrayControlsData
} from './form-array-group.type';
import {
  AngularArrayList,
  AngularArrayListValueToControls
} from './form-array-list.type';
import {
  controlsToValue,
  verifyAnyTrueInControls
} from '../form-group/form-group.helper';

export class FormArrayList<
    C extends AngularArrayControls = AngularArrayControls
  >
  extends FormSignalControl<AngularArrayControlsData<C>[]>
  implements AngularArrayList<C>
{
  public readonly uuid: string;

  private signal: WritableSignal<C[]>;

  constructor(
    private valueToControls: AngularArrayListValueToControls<C>,
    value?: AngularArrayControlsData<C>[],
    validators?: ValidatorFn<AngularArrayControlsData<C>[]>[]
  ) {
    const formArrayList = value || [];

    const focused = signal(false);
    const disabled = signal(false);

    const touched = computed(() =>
      this.signal().reduce(
        (touched, controls) =>
          touched || verifyAnyTrueInControls(controls, 'touched'),
        false
      )
    );

    const dirty = computed(() =>
      this.signal().reduce(
        (dirty, controls) =>
          dirty || verifyAnyTrueInControls(controls, 'dirty'),
        false
      )
    );

    const valueSignal = computed(() => this.signal().map(controlsToValue));
    const validatorsSignal = signal(validators);

    const errors = computed(() => {
      const validators = validatorsSignal();
      const value = valueSignal();

      return validators ? formControlIsValid({ value, validators }) : [];
    });

    const valid = computed(() => errors().length === 0);

    super(formArrayList, {
      dirty,
      disabled,
      enabled: computed(() => !disabled()),
      error: computed(() => errors()[0]),
      errors,
      focused,
      invalid: computed(() => !valid()),
      pristine: computed(() => !dirty()),
      touched,
      unfocused: computed(() => !focused()),
      untouched: computed(() => !touched()),
      valid,
      validators: validatorsSignal,
      value: valueSignal,
      wrong: computed(() => touched() && !valid())
    });

    this.uuid = uuid();
    this.signal = signal(formArrayList.map(valueToControls));
  }

  public get controls(): Signal<C[]> {
    return this.signal;
  }

  public setValue(values: AngularArrayControlsData<C>[]): void {
    this.signal.set(values.map(this.valueToControls));
  }

  public push(controls: C): void {
    this.signal.set(this.signal().concat([controls]));
  }

  public remove(controls: C): void {
    this.signal.set(this.signal().filter((item) => item !== controls));
  }
}

export function formArrayList<
  C extends AngularArrayControls = AngularArrayControls
>(
  valueToControl: AngularArrayListValueToControls<C>,
  value?: AngularArrayControlsData<C>[],
  validators?: ValidatorFn<AngularArrayControlsData<C>[]>[]
): FormArrayList<C> {
  return new FormArrayList(valueToControl, value, validators);
}

import { computed, signal, Signal, WritableSignal } from '@angular/core';
import { ValidatorError, ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormSignalControl } from '../form-control/form-signal-control';
import { controlsToData, reduceControlsBoolean } from '../helpers';
import {
  AngularArrayControls,
  AngularArrayControlsData,
  AngularArrayList,
  AngularArrayListValueToControls
} from '../types';

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
    const formValue = value || [];

    const focused = signal(false);
    const disabled = signal(false);
    const errors = signal<ValidatorError[]>([]);

    const touched = computed(() =>
      this.signal().reduce((touched, controls) => {
        return (
          touched ||
          reduceControlsBoolean(controls, (control) => control.touched())
        );
      }, false)
    );

    const dirty = computed(() =>
      this.signal().reduce((dirty, controls) => {
        return (
          dirty || reduceControlsBoolean(controls, (control) => control.dirty())
        );
      }, false)
    );

    const valid = computed(() =>
      this.signal().reduce((valid, controls) => {
        return (
          valid && reduceControlsBoolean(controls, (control) => control.valid())
        );
      }, true)
    );

    super(
      formValue,
      {
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
        value: computed(() => this.signal().map(controlsToData)),
        wrong: computed(() => touched() && !valid())
      },
      validators
    );

    this.uuid = uuid();
    this.signal = signal(formValue.map(valueToControls));
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

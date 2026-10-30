import { computed, signal, WritableSignal } from '@angular/core';
import { ArrayControlsValue, ArrayListValueToControls } from '@rolster/forms';
import {
  controlsToValue,
  formControlIsValid,
  verifyAllTrueInControls
} from '@rolster/forms/helpers';
import { v4 as uuid } from 'uuid';
import { FormSignalControl } from '../form-control/form-signal-control';
import { AngularArrayControls } from './form-array-group.type';
import {
  AngularArrayList,
  AngularListOptions,
  ArrayListSignals,
  ArrayListValueToUuid
} from './form-array-list.type';

export class FormArrayList<
    C extends AngularArrayControls = AngularArrayControls,
    E extends HTMLElement = HTMLElement
  >
  extends FormSignalControl<ArrayControlsValue<C>[], E>
  implements AngularArrayList<C, E>
{
  public readonly uuid: string;

  private readonly controlsState: WritableSignal<C[]>;

  private readonly controlsUuidState: WritableSignal<string[]>;

  private readonly listSignals: ArrayListSignals<C>;

  private readonly valueToControls: ArrayListValueToControls<C>;

  private readonly valueToUuid?: ArrayListValueToUuid<C>;

  constructor(options: AngularListOptions<C>) {
    const { valueToControls, valueToUuid } = options;

    const defaultValue = options.value ?? [];

    const controlsState = signal(defaultValue.map(valueToControls));
    const controlsUuidState = signal(
      defaultValue.map((value) => valueToUuid?.(value) ?? uuid())
    );

    const validators = signal(options.validators);
    const value = computed(() => controlsState().map(controlsToValue<C>));

    const errors = computed(() => {
      const listValidators = validators();

      return listValidators
        ? formControlIsValid({ value: value(), validators: listValidators })
        : [];
    });

    const valid = computed(
      () =>
        errors().length === 0 &&
        controlsState().every((controls) =>
          verifyAllTrueInControls(controls, 'valid')
        )
    );

    super(defaultValue, {
      dirty: signal(false),
      disabled: signal(false),
      errors,
      focused: signal(false),
      touched: signal(!!options.touched),
      valid,
      validators,
      value
    });

    this.uuid = uuid();
    this.valueToControls = valueToControls;
    this.valueToUuid = valueToUuid;
    this.controlsState = controlsState;
    this.controlsUuidState = controlsUuidState;

    this.listSignals = {
      ...this.controlSignals,
      controls: controlsState.asReadonly(),
      controlsUuid: controlsUuidState.asReadonly()
    };
  }

  public override get signals(): ArrayListSignals<C> {
    return this.listSignals;
  }

  public get controls(): C[] {
    return this.listSignals.controls();
  }

  public get controlsUuid(): string[] {
    return this.listSignals.controlsUuid();
  }

  public push(controls: C): void {
    const controlsUuid =
      this.valueToUuid?.(controlsToValue<C>(controls)) ?? uuid();

    this.controlsState.update((current) => [...current, controls]);
    this.controlsUuidState.update((current) => [...current, controlsUuid]);
  }

  public remove(controls: C): void {
    const index = this.controlsState().indexOf(controls);

    if (index < 0) {
      return;
    }

    this.controlsState.update((current) =>
      current.filter((_, position) => position !== index)
    );
    this.controlsUuidState.update((current) =>
      current.filter((_, position) => position !== index)
    );
  }

  public findControlsByUuid(uuid: string): Undefined<C> {
    const index = this.controlsUuidState().indexOf(uuid);

    return index >= 0 ? this.controlsState()[index] : undefined;
  }

  protected writeValue(value: ArrayControlsValue<C>[]): void {
    this.controlsState.set(value.map(this.valueToControls));
    this.controlsUuidState.set(
      value.map((item) => this.valueToUuid?.(item) ?? uuid())
    );
  }
}

export function formArrayList<
  C extends AngularArrayControls = AngularArrayControls
>(options: AngularListOptions<C>): FormArrayList<C> {
  return new FormArrayList<C, HTMLElement>(options);
}

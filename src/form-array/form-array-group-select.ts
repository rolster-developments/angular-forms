import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { AngularFormArray } from './form-array.type';
import {
  AngularArrayControls,
  AngularArrayGroup
} from './form-array-group.type';

interface FormArrayGroupSelectOptions<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
> {
  formArray: AngularFormArray<C, R, G>;
}

export class FormArrayGroupSelect<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
> {
  public readonly signal: Signal<Undefined<G>>;

  private readonly selectedState: WritableSignal<Undefined<G>>;

  constructor({ formArray }: FormArrayGroupSelectOptions<C, R, G>) {
    this.selectedState = signal<Undefined<G>>(undefined);

    this.signal = computed(() => {
      const selected = this.selectedState();

      return (
        selected && formArray.groups.find(({ uuid }) => uuid === selected.uuid)
      );
    });
  }

  public get formGroup(): Undefined<G> {
    return this.signal();
  }

  public setFormGroup(formGroup?: G): void {
    this.selectedState.set(formGroup);
  }
}

export function formArrayGroupSelect<
  C extends AngularArrayControls = AngularArrayControls,
  R = any,
  G extends AngularArrayGroup<C, R> = AngularArrayGroup<C, R>
>(
  options: FormArrayGroupSelectOptions<C, R, G>
): FormArrayGroupSelect<C, R, G> {
  return new FormArrayGroupSelect<C, R, G>(options);
}

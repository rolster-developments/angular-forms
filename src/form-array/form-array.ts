import {
  AbstractArrayGroup,
  ArrayStateGroup,
  ArrayValueGroup,
  FormArrayProps,
  ValidatorArrayFn,
  createFormArrayProps
} from '@rolster/helpers-forms';
import {
  arrayIsValid,
  groupAllChecked,
  groupPartialChecked
} from '@rolster/helpers-forms/helpers';
import { ValidatorError } from '@rolster/validators';
import {
  AngularFormArray,
  AngularFormArrayControls,
  AngularFormArrayGroup
} from '../types-angular';

type AngularArrayProps<G extends AngularFormArrayControls, R> = FormArrayProps<
  G,
  R,
  AngularFormArrayGroup<G, R>
>;

export class FormArray<
  G extends AngularFormArrayControls = AngularFormArrayControls,
  R = any
> implements AngularFormArray<G>
{
  private currentGroups: AngularFormArrayGroup<G, R>[] = [];

  private initialState?: AngularFormArrayGroup<G, R>[];

  private currentValid = true;

  private currentError?: ValidatorError;

  private currentErrors: ValidatorError[] = [];

  private validators?: ValidatorArrayFn<G, R>[];

  constructor();
  constructor(props: AngularArrayProps<G, R>);
  constructor(
    groups: AngularFormArrayGroup<G, R>[],
    validators?: ValidatorArrayFn<G, R>[]
  );
  constructor(
    arrayProps?: AngularArrayProps<G, R> | AngularFormArrayGroup<G, R>[],
    arrayValidators?: ValidatorArrayFn<G, R>[]
  ) {
    const { groups, validators } = createFormArrayProps(
      arrayProps,
      arrayValidators
    );

    this.initialState = groups;

    this.initialState?.forEach((group) => group.setParent(this));

    this.validators = validators;

    this.refresh(this.initialState);
  }

  public get groups(): AngularFormArrayGroup<G, R>[] {
    return this.currentGroups;
  }

  public get controls(): G[] {
    return this.groups.map(({ controls }) => controls);
  }

  public get touched(): boolean {
    return groupPartialChecked(this.currentGroups, 'touched');
  }

  public get toucheds(): boolean {
    return groupAllChecked(this.currentGroups, 'toucheds');
  }

  public get untouched(): boolean {
    return !this.touched;
  }

  public get untoucheds(): boolean {
    return !this.toucheds;
  }

  public get dirty(): boolean {
    return groupPartialChecked(this.currentGroups, 'dirty');
  }

  public get dirties(): boolean {
    return groupAllChecked(this.currentGroups, 'dirties');
  }

  public get pristine(): boolean {
    return !this.dirty;
  }

  public get pristines(): boolean {
    return !this.dirties;
  }

  public get valid(): boolean {
    return this.currentValid && groupAllChecked(this.currentGroups, 'valid');
  }

  public get invalid(): boolean {
    return !this.currentValid;
  }

  public get state(): ArrayStateGroup<G>[] {
    return this.currentGroups.map((group) => group.state);
  }

  public get value(): ArrayValueGroup<G>[] {
    return this.currentGroups.map((group) => group.value);
  }

  public get error(): ValidatorError | undefined {
    return this.currentError;
  }

  public get errors(): ValidatorError[] {
    return this.currentErrors;
  }

  public get wrong(): boolean {
    return this.touched && this.invalid;
  }

  public reset(): void {
    this.refresh(this.initialState);
  }

  public push(group: AngularFormArrayGroup<G, R>): void {
    group.setParent(this);

    this.refresh([...this.currentGroups, group]);
  }

  public merge(groups: AngularFormArrayGroup<G, R>[]): void {
    groups.forEach((group) => group.setParent(this));

    this.refresh([...this.currentGroups, ...groups]);
  }

  public set(groups: AngularFormArrayGroup<G, R>[]): void {
    groups.forEach((group) => group.setParent(this));

    this.refresh(groups);
  }

  public remove({ uuid }: AbstractArrayGroup<G, R>): void {
    this.refresh(this.currentGroups.filter((group) => group.uuid !== uuid));
  }

  public setValidators(validators: ValidatorArrayFn<G, R>[]): void {
    this.validators = validators;
  }

  public updateValueAndValidity(groups = true): void {
    if (groups) {
      this.currentGroups.forEach((group) => group.updateValueAndValidity(true));
    }

    if (this.validators) {
      const { groups, validators } = this;

      const errors = arrayIsValid({ groups, validators });

      this.currentErrors = errors;
      this.currentError = errors[0];

      this.currentValid = errors.length === 0;
    } else {
      this.currentValid = true;
      this.currentErrors = [];
      this.currentError = undefined;
    }
  }

  private refresh(groups?: AngularFormArrayGroup<G, R>[]): void {
    this.currentGroups = groups || [];

    this.updateValueAndValidity();
  }
}

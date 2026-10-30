import { createFormControlOptions } from '@rolster/forms/helpers';
import { ValidatorFn } from '@rolster/validators';
import { v4 as uuid } from 'uuid';
import { FormControl } from '../form-control/form-control';
import {
  AngularArrayControl,
  AngularArrayControlOptions
} from './form-array-control.type';

export class FormArrayControl<T = any, E extends HTMLElement = HTMLElement>
  extends FormControl<T, E>
  implements AngularArrayControl<T, E>
{
  public readonly uuid: string;

  constructor();
  constructor(options: AngularArrayControlOptions<T>);
  constructor(value: T, validators?: ValidatorFn<T>[]);
  constructor(
    options?: AngularArrayControlOptions<T> | T,
    validators?: ValidatorFn<T>[]
  ) {
    const formControl = createFormControlOptions<
      T,
      AngularArrayControlOptions<T>
    >(options, validators);

    super(formControl);

    this.uuid = formControl.uuid ?? uuid();
  }
}

export type FormArrayVoid<
  T = any,
  E extends HTMLElement = HTMLElement
> = FormArrayControl<T | undefined, E>;

type ArrayValueOptions<T> = Omit<AngularArrayControlOptions<T>, 'validators'>;
type ArrayValidatorsOptions<T> = Omit<AngularArrayControlOptions<T>, 'value'>;

export function angularArrayControl<
  T,
  E extends HTMLElement
>(): FormArrayControl<T | undefined, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  options: ArrayValueOptions<T>
): FormArrayControl<T, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  options: ArrayValidatorsOptions<T>
): FormArrayControl<T | undefined, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  options: AngularArrayControlOptions<T>
): FormArrayControl<T, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T | undefined, E>;
export function angularArrayControl<T, E extends HTMLElement>(
  options?: AngularArrayControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T, E> {
  return new FormArrayControl<T, E>(
    createFormControlOptions<T, AngularArrayControlOptions<T>>(
      options,
      validators
    )
  );
}

export function formArrayControl<T>(): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options: ArrayValueOptions<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  options: ArrayValidatorsOptions<T>
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options: AngularArrayControlOptions<T>
): FormArrayControl<T>;
export function formArrayControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T>;
export function formArrayControl<T>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T | undefined>;
export function formArrayControl<T>(
  options?: AngularArrayControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T> {
  return angularArrayControl<T, HTMLElement>(
    createFormControlOptions<T, AngularArrayControlOptions<T>>(
      options,
      validators
    )
  );
}

export function inputArrayControl<T>(): FormArrayControl<
  T | undefined,
  HTMLInputElement
>;
export function inputArrayControl<T>(
  options: ArrayValueOptions<T>
): FormArrayControl<T, HTMLInputElement>;
export function inputArrayControl<T>(
  options: ArrayValidatorsOptions<T>
): FormArrayControl<T | undefined, HTMLInputElement>;
export function inputArrayControl<T>(
  options: AngularArrayControlOptions<T>
): FormArrayControl<T, HTMLInputElement>;
export function inputArrayControl<T>(
  value: T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T, HTMLInputElement>;
export function inputArrayControl<T>(
  value: Undefined<T>,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T | undefined, HTMLInputElement>;
export function inputArrayControl<T>(
  options?: AngularArrayControlOptions<T> | T,
  validators?: ValidatorFn<T>[]
): FormArrayControl<T, HTMLInputElement> {
  return angularArrayControl<T, HTMLInputElement>(
    createFormControlOptions<T, AngularArrayControlOptions<T>>(
      options,
      validators
    )
  );
}

export function areaArrayControl(): FormArrayControl<
  string | undefined,
  HTMLTextAreaElement
>;
export function areaArrayControl(
  options: ArrayValueOptions<string>
): FormArrayControl<string, HTMLTextAreaElement>;
export function areaArrayControl(
  options: AngularArrayControlOptions<string>
): FormArrayControl<string, HTMLTextAreaElement>;
export function areaArrayControl(
  value: string,
  validators?: ValidatorFn<string>[]
): FormArrayControl<string, HTMLTextAreaElement>;
export function areaArrayControl(
  value: Undefined<string>,
  validators?: ValidatorFn<string>[]
): FormArrayControl<string | undefined, HTMLTextAreaElement>;
export function areaArrayControl(
  options?: AngularArrayControlOptions<string> | string,
  validators?: ValidatorFn<string>[]
):
  | FormArrayControl<string, HTMLTextAreaElement>
  | FormArrayControl<string | undefined, HTMLTextAreaElement> {
  return angularArrayControl<string, HTMLTextAreaElement>(
    createFormControlOptions<string, AngularArrayControlOptions<string>>(
      options,
      validators
    )
  );
}

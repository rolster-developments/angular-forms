import { ValidatorFn } from '@rolster/validators';
import { FormControl } from '../form-control/form-control';
import { AngularFormList } from './form-list.type';

export class FormList<T = any, E extends HTMLElement = HTMLElement>
  extends FormControl<T[], E>
  implements AngularFormList<T, E>
{
  constructor(value?: T[], validators?: ValidatorFn<T[]>[]) {
    super(value ?? [], validators);
  }

  public push(item: T): void {
    this.setValue((current) => [...current, item]);
  }

  public remove(item: T): void {
    this.setValue((current) => {
      const value = current.filter((currentItem) => currentItem !== item);

      return value.length === current.length ? current : value;
    });
  }

  public clear(): void {
    this.setValue((current) => (current.length > 0 ? [] : current));
  }
}

export function angularList<T, E extends HTMLElement>(
  value?: T[],
  validators?: ValidatorFn<T[]>[]
): FormList<T, E> {
  return new FormList<T, E>(value, validators);
}

export function formList<T>(
  value?: T[],
  validators?: ValidatorFn<T[]>[]
): FormList<T> {
  return angularList<T, HTMLElement>(value, validators);
}

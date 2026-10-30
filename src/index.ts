import { AngularArrayControl } from './form-array/form-array-control.type';
import { AngularFormControl } from './form-control/form-control.type';

export { FormArray, formArray } from './form-array/form-array';
export * from './form-array/form-array.type';
export {
  angularArrayControl,
  areaArrayControl,
  FormArrayControl,
  formArrayControl,
  FormArrayVoid,
  inputArrayControl
} from './form-array/form-array-control';
export * from './form-array/form-array-control.type';
export { FormArrayGroup, formArrayGroup } from './form-array/form-array-group';
export * from './form-array/form-array-group.type';
export {
  FormArrayGroupSelect,
  formArrayGroupSelect
} from './form-array/form-array-group-select';
export { FormArrayList, formArrayList } from './form-array/form-array-list';
export * from './form-array/form-array-list.type';
export {
  angularControl,
  AngularControlOptions,
  areaControl,
  FormControl,
  formControl,
  FormVoid,
  inputControl
} from './form-control/form-control';
export * from './form-control/form-control.type';
export { FormGroup, formGroup } from './form-group/form-group';
export * from './form-group/form-group.type';
export { angularList, FormList, formList } from './form-list/form-list';
export * from './form-list/form-list.type';
export * from './helpers';

export type AngularControl<T = any, E extends HTMLElement = HTMLElement> =
  | AngularFormControl<T, E>
  | AngularArrayControl<T, E>;

export type AngularVoid<
  T = any,
  E extends HTMLElement = HTMLElement
> = AngularControl<T | undefined, E>;

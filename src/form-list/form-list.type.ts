import { AngularFormControl } from '../form-control/form-control.type';

export interface AngularFormList<T = any, E extends HTMLElement = HTMLElement>
  extends AngularFormControl<T[], E> {
  clear: () => void;
  push: (item: T) => void;
  remove: (item: T) => void;
}

export type AngularHtmlList<T = any> = AngularFormList<T, HTMLElement>;

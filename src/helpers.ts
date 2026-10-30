import { reduceControlsToArray } from '@rolster/forms/helpers';
import { AngularFormControl } from './form-control/form-control.type';
import { AngularControls, AngularGroup } from './form-group/form-group.type';

export function reduceControlsToValues<
  T extends AngularFormControl,
  C extends AngularControls<T>
>(controls: C): T['value'][] {
  return reduceControlsToArray(controls, 'value');
}

export function reduceGroupToValues<
  T extends AngularFormControl,
  C extends AngularControls<T>
>(group: AngularGroup<C>): T['value'][] {
  return reduceControlsToValues(group.controls);
}

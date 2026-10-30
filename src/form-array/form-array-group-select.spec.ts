import { formArray } from './form-array';
import { formArrayControl } from './form-array-control';
import { formArrayGroup } from './form-array-group';
import { formArrayGroupSelect } from './form-array-group-select';

function createSelect() {
  const group = formArrayGroup({
    controls: { name: formArrayControl('rolster') }
  });

  const array = formArray([group]);
  const select = formArrayGroupSelect({ formArray: array });

  return { array, select };
}

describe('formArrayGroupSelect', () => {
  it('should return the selected group of the form array', () => {
    const { array, select } = createSelect();

    expect(select.formGroup).toBeUndefined();

    select.setFormGroup(array.groups[0]);

    expect(select.formGroup).toBe(array.groups[0]);
    expect(select.signal()).toBe(array.groups[0]);
  });

  it('should keep the group when a control changes', () => {
    const { array, select } = createSelect();

    select.setFormGroup(array.groups[0]);
    array.groups[0].controls.name.setValue('angular');

    expect(select.formGroup?.value).toEqual({ name: 'angular' });
  });

  it('should return undefined when the selected group is removed', () => {
    const { array, select } = createSelect();

    select.setFormGroup(array.groups[0]);
    array.remove(array.groups[0]);

    expect(select.formGroup).toBeUndefined();
  });
});

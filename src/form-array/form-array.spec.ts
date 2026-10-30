import { computed } from '@angular/core';
import { ValidatorArrayFn } from '@rolster/forms';
import { formArray } from './form-array';
import { formArrayControl } from './form-array-control';
import { AngularHtmlArrayControl } from './form-array-control.type';
import { formArrayGroup } from './form-array-group';

interface ContactControls {
  name: AngularHtmlArrayControl<string>;
  [key: string]: AngularHtmlArrayControl<string>;
}

function createContactGroup(name: string, uuid?: string) {
  return formArrayGroup<ContactControls>({
    controls: { name: formArrayControl(name) },
    uuid
  });
}

const minTwoGroups: ValidatorArrayFn<ContactControls> = (groups) =>
  groups.length >= 2
    ? undefined
    : { id: 'minGroups', message: 'Array requires at least 2 groups' };

describe('formArray', () => {
  describe('initial state', () => {
    it('should create an empty array without arguments', () => {
      const array = formArray<ContactControls>();

      expect(array.groups).toEqual([]);
      expect(array.value).toEqual([]);
      expect(array.controls).toEqual([]);
      expect(array.dirty).toBe(false);
      expect(array.touched).toBe(false);
      expect(array.valid).toBe(true);
    });

    it('should create an array with the initial groups', () => {
      const array = formArray<ContactControls>([
        createContactGroup('rolster'),
        createContactGroup('angular')
      ]);

      expect(array.groups.length).toBe(2);
      expect(array.value).toEqual([{ name: 'rolster' }, { name: 'angular' }]);
    });

    it('should create an array from an options object', () => {
      const array = formArray<ContactControls>({
        groups: [createContactGroup('rolster')],
        validators: [minTwoGroups]
      });

      expect(array.value).toEqual([{ name: 'rolster' }]);
      expect(array.validators?.length).toBe(1);
    });
  });

  describe('push', () => {
    it('should add the group to the array', () => {
      const array = formArray<ContactControls>();

      array.push(createContactGroup('rolster'));

      expect(array.groups.length).toBe(1);
      expect(array.value).toEqual([{ name: 'rolster' }]);
    });

    it('should synchronize changes of the controls of a pushed group', () => {
      const array = formArray<ContactControls>();

      array.push(createContactGroup('rolster'));
      array.groups[0].controls.name.setValue('angular');

      expect(array.value).toEqual([{ name: 'angular' }]);
      expect(array.groups[0].dirty).toBe(true);
    });
  });

  describe('merge', () => {
    it('should add all the given groups to the array', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.merge([createContactGroup('react'), createContactGroup('angular')]);

      expect(array.value).toEqual([
        { name: 'rolster' },
        { name: 'react' },
        { name: 'angular' }
      ]);
    });
  });

  describe('remove', () => {
    it('should remove the group from the array', () => {
      const array = formArray<ContactControls>([
        createContactGroup('rolster'),
        createContactGroup('angular')
      ]);

      array.remove(array.groups[0]);

      expect(array.value).toEqual([{ name: 'angular' }]);
    });
  });

  describe('findByUuid', () => {
    it('should find a group by its uuid', () => {
      const array = formArray<ContactControls>([
        createContactGroup('rolster', 'group-rolster')
      ]);

      expect(array.findByUuid('group-rolster')?.value).toEqual({
        name: 'rolster'
      });
      expect(array.findByUuid('group-unknown')).toBeUndefined();
    });

    it('should find the replaced groups by uuid', () => {
      const array = formArray<ContactControls>([
        createContactGroup('', 'group-empty')
      ]);

      array.setValue([createContactGroup('rolster', 'group-loaded')]);

      expect(array.findByUuid('group-loaded')).toBeDefined();
      expect(array.findByUuid('group-empty')).toBeUndefined();
    });
  });

  describe('setValue', () => {
    it('should replace the groups of the array', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.setValue([
        createContactGroup('react'),
        createContactGroup('angular')
      ]);

      expect(array.value).toEqual([{ name: 'react' }, { name: 'angular' }]);
    });
  });

  describe('controls synchronization', () => {
    it('should update the array value when a control of a group changes', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.groups[0].controls.name.setValue('angular');

      expect(array.value).toEqual([{ name: 'angular' }]);
      expect(array.controls[0].name.value).toBe('angular');
    });

    it('should reflect the group validity when its validators change', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      const nameRequired = ({ name }: ContactControls) =>
        name.value
          ? undefined
          : { id: 'nameRequired', message: 'Name is required' };

      array.groups[0].controls.name.setValue('');
      array.groups[0].setValidators([nameRequired]);

      expect(array.groups[0].errors[0]?.id).toBe('nameRequired');
      expect(array.groups[0].valid).toBe(false);
      expect(array.valid).toBe(false);
    });

    it('should keep the same group instance when a control changes', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      const initialGroup = array.groups[0];

      array.groups[0].controls.name.touch();

      expect(array.groups[0]).toBe(initialGroup);
      expect(array.groups[0].touched).toBe(true);
    });
  });

  describe('array validators', () => {
    it('should evaluate validators over the groups', () => {
      const array = formArray<ContactControls>(
        [createContactGroup('rolster')],
        [minTwoGroups]
      );

      expect(array.valid).toBe(false);
      expect(array.error?.id).toBe('minGroups');
      expect(array.hasError('minGroups')).toBe(true);
      expect(array.someErrors(['minGroups', 'unknown'])).toBe(true);
      expect(array.someErrors(['unknown'])).toBe(false);

      array.push(createContactGroup('angular'));

      expect(array.valid).toBe(true);
    });

    it('should revalidate the groups with setValidators', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      expect(array.valid).toBe(true);

      array.setValidators([minTwoGroups]);

      expect(array.valid).toBe(false);
    });
  });

  describe('state aggregation', () => {
    it('should be touched when some group is touched and toucheds when all are', () => {
      const array = formArray<ContactControls>([
        createContactGroup('rolster'),
        createContactGroup('angular')
      ]);

      array.groups[0].controls.name.touch();

      expect(array.touched).toBe(true);
      expect(array.toucheds).toBe(false);
      expect(array.untouched).toBe(false);

      array.groups[1].controls.name.touch();

      expect(array.toucheds).toBe(true);
      expect(array.untoucheds).toBe(false);
    });

    it('should be dirty when some group changes value and dirties when all change', () => {
      const array = formArray<ContactControls>([
        createContactGroup('rolster'),
        createContactGroup('angular')
      ]);

      array.groups[0].controls.name.setValue('react');

      expect(array.dirty).toBe(true);
      expect(array.dirties).toBe(false);
      expect(array.pristine).toBe(false);

      array.groups[1].controls.name.setValue('vue');

      expect(array.dirties).toBe(true);
      expect(array.pristines).toBe(false);
    });

    it('should clear the dirty state when the array is reset', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.groups[0].controls.name.setValue('angular');

      expect(array.dirty).toBe(true);

      array.reset();

      expect(array.dirty).toBe(false);
    });
  });

  describe('signals', () => {
    it('should expose the groups and the value as signals', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      expect(array.signals.groups().length).toBe(1);
      expect(array.signal()).toEqual([{ name: 'rolster' }]);

      array.push(createContactGroup('angular'));

      expect(array.signals.groups().length).toBe(2);
      expect(array.signals.controls().length).toBe(2);
    });

    it('should track nested control changes inside a computed', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);
      const names = computed(() => array.value.map(({ name }) => name));

      expect(names()).toEqual(['rolster']);

      array.groups[0].controls.name.setValue('angular');

      expect(names()).toEqual(['angular']);
    });
  });

  describe('disable and enable', () => {
    it('should toggle the disabled state of the array', () => {
      const array = formArray<ContactControls>();

      array.disable();

      expect(array.disabled).toBe(true);
      expect(array.enabled).toBe(false);

      array.enable();

      expect(array.enabled).toBe(true);
    });
  });

  describe('reset', () => {
    it('should restore the value of the controls modified in the group', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.groups[0].controls.name.setValue('angular');
      array.reset();

      expect(array.value).toEqual([{ name: 'rolster' }]);
    });

    it('should restore the initial groups of the array', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.push(createContactGroup('angular'));

      expect(array.groups.length).toBe(2);

      array.reset();

      expect(array.groups.length).toBe(1);
      expect(array.value).toEqual([{ name: 'rolster' }]);
    });

    it('should restore the groups defined with setDefaultValue', () => {
      const array = formArray<ContactControls>([createContactGroup('rolster')]);

      array.setDefaultValue([createContactGroup('angular')]);
      array.push(createContactGroup('react'));
      array.reset();

      expect(array.value).toEqual([{ name: 'angular' }]);
    });
  });
});

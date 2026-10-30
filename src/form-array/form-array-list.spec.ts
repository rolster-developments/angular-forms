import { computed } from '@angular/core';
import { ValidatorFn } from '@rolster/validators';
import { formArrayControl } from './form-array-control';
import { AngularHtmlArrayControl } from './form-array-control.type';
import { formArrayList } from './form-array-list';

interface ContactControls {
  name: AngularHtmlArrayControl<string>;
  [key: string]: AngularHtmlArrayControl<string>;
}

type ContactValue = { name: string };

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

function valueToControls(value: ContactValue): ContactControls {
  return { name: formArrayControl(value.name, [required]) };
}

const minTwoContacts: ValidatorFn<ContactValue[]> = (value) =>
  value && value.length >= 2
    ? undefined
    : { id: 'minContacts', message: 'List requires at least 2 contacts' };

describe('formArrayList', () => {
  describe('initial state', () => {
    it('should create an empty list without initial value', () => {
      const list = formArrayList({ valueToControls });

      expect(list.uuid).toBeDefined();
      expect(list.value).toEqual([]);
      expect(list.controls).toEqual([]);
      expect(list.dirty).toBe(false);
      expect(list.touched).toBe(false);
      expect(list.valid).toBe(true);
    });

    it('should build the controls from the initial value', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }, { name: 'angular' }],
        valueToControls
      });

      expect(list.controls.length).toBe(2);
      expect(list.controlsUuid.length).toBe(2);
      expect(list.value).toEqual([{ name: 'rolster' }, { name: 'angular' }]);
      expect(list.controls[0].name.value).toBe('rolster');
    });

    it('should evaluate validators against the initial value', () => {
      const list = formArrayList({
        validators: [minTwoContacts],
        value: [{ name: 'rolster' }],
        valueToControls
      });

      expect(list.valid).toBe(false);
      expect(list.error?.id).toBe('minContacts');
    });

    it('should be invalid when some inner control is invalid', () => {
      const list = formArrayList({
        value: [{ name: '' }],
        valueToControls
      });

      expect(list.valid).toBe(false);

      list.controls[0].name.setValue('rolster');

      expect(list.valid).toBe(true);
    });
  });

  describe('push', () => {
    it('should add the controls to the list', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }],
        valueToControls
      });

      list.push(valueToControls({ name: 'angular' }));

      expect(list.value).toEqual([{ name: 'rolster' }, { name: 'angular' }]);
      expect(list.controlsUuid.length).toBe(2);
    });
  });

  describe('remove', () => {
    it('should remove the given controls from the list', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }, { name: 'angular' }],
        valueToControls
      });

      list.remove(list.controls[0]);

      expect(list.value).toEqual([{ name: 'angular' }]);
      expect(list.controls.length).toBe(1);
      expect(list.controlsUuid.length).toBe(1);
    });

    it('should ignore controls that are not in the list', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }],
        valueToControls
      });

      list.remove(valueToControls({ name: 'angular' }));

      expect(list.controls.length).toBe(1);
    });
  });

  describe('setValue', () => {
    it('should rebuild the controls and mark the list as dirty', () => {
      const list = formArrayList({ valueToControls });

      list.setValue([{ name: 'rolster' }, { name: 'angular' }]);

      expect(list.value).toEqual([{ name: 'rolster' }, { name: 'angular' }]);
      expect(list.dirty).toBe(true);
      expect(list.controls.length).toBe(2);
    });

    it('should rebuild the controls with setStartValue without marking dirty', () => {
      const list = formArrayList({ valueToControls });

      list.setStartValue([{ name: 'rolster' }]);

      expect(list.value).toEqual([{ name: 'rolster' }]);
      expect(list.dirty).toBe(false);
    });
  });

  describe('reset', () => {
    it('should restore the default value of the list', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }],
        valueToControls
      });

      list.setValue([{ name: 'react' }, { name: 'angular' }]);
      list.touch();
      list.reset();

      expect(list.value).toEqual([{ name: 'rolster' }]);
      expect(list.dirty).toBe(false);
      expect(list.touched).toBe(false);
    });

    it('should restore the value defined with setDefaultValue', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }],
        valueToControls
      });

      list.setDefaultValue([{ name: 'react' }]);
      list.setValue([{ name: 'angular' }]);
      list.reset();

      expect(list.value).toEqual([{ name: 'react' }]);
    });
  });

  describe('findControlsByUuid', () => {
    it('should find the controls using the uuid generated by valueToUuid', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }, { name: 'angular' }],
        valueToControls,
        valueToUuid: ({ name }) => name
      });

      expect(list.findControlsByUuid('angular')?.name.value).toBe('angular');
      expect(list.findControlsByUuid('unknown')).toBeUndefined();
    });
  });

  describe('controls synchronization', () => {
    it('should update the list value when an inner control changes', () => {
      const list = formArrayList({
        value: [{ name: 'rolster' }],
        valueToControls
      });

      list.controls[0].name.setValue('angular');

      expect(list.value).toEqual([{ name: 'angular' }]);
      expect(list.signal()).toEqual([{ name: 'angular' }]);
    });

    it('should track the controls inside a computed', () => {
      const list = formArrayList({ valueToControls });
      const size = computed(() => list.controls.length);

      list.push(valueToControls({ name: 'rolster' }));

      expect(size()).toBe(1);
      expect(list.signals.controls().length).toBe(1);
      expect(list.signals.controlsUuid().length).toBe(1);
    });
  });
});

import { ValidatorGroupFn } from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import { FormArrayControl, formArrayControl } from './form-array-control';
import { formArrayGroup } from './form-array-group';

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

describe('formArrayGroup', () => {
  describe('initial state', () => {
    it('should aggregate the value of its controls', () => {
      const group = formArrayGroup({
        controls: {
          language: formArrayControl('typescript'),
          name: formArrayControl('rolster')
        }
      });

      expect(group.uuid).toBeDefined();
      expect(group.value).toEqual({ language: 'typescript', name: 'rolster' });
      expect(group.dirty).toBe(false);
      expect(group.touched).toBe(false);
      expect(group.valid).toBe(true);
      expect(group.wrong).toBe(false);
    });

    it('should use the given uuid when it is provided', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('rolster') },
        uuid: 'group-uuid'
      });

      expect(group.uuid).toBe('group-uuid');
    });

    it('should create groups with unique uuid', () => {
      const controls = { name: formArrayControl('rolster') };

      expect(formArrayGroup(controls).uuid).not.toBe(
        formArrayGroup(controls).uuid
      );
    });

    it('should be invalid when some control is invalid', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('', [required]) }
      });

      expect(group.valid).toBe(false);
      expect(group.invalid).toBe(true);
    });

    it('should store the given resource', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('rolster') },
        resource: { id: 10 }
      });

      expect(group.resource).toEqual({ id: 10 });
      expect(group.signals.resource()).toEqual({ id: 10 });
    });
  });

  describe('controls synchronization', () => {
    it('should update the group when a control value changes', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl<string>('', [required]) }
      });

      group.controls.name.setValue('rolster');

      expect(group.value).toEqual({ name: 'rolster' });
      expect(group.dirty).toBe(true);
      expect(group.valid).toBe(true);
    });

    it('should be touched when a control is touched', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('rolster') }
      });

      group.controls.name.touch();

      expect(group.touched).toBe(true);
      expect(group.toucheds).toBe(true);
    });
  });

  describe('group validators', () => {
    it('should evaluate validators over all the controls', () => {
      const nameNotEqualLanguage: ValidatorGroupFn<{
        language: FormArrayControl<string>;
        name: FormArrayControl<string>;
      }> = ({ language, name }) =>
        name.value !== language.value
          ? undefined
          : { id: 'nameNotEqualLanguage', message: 'Values are equals' };

      const group = formArrayGroup({
        controls: {
          language: formArrayControl('typescript'),
          name: formArrayControl('typescript')
        },
        validators: [nameNotEqualLanguage]
      });

      expect(group.valid).toBe(false);
      expect(group.error?.id).toBe('nameNotEqualLanguage');
    });

    it('should revalidate the controls with setValidators', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('') }
      });

      const nameRequired: ValidatorGroupFn<{
        name: FormArrayControl<string>;
      }> = ({ name }) =>
        name.value
          ? undefined
          : { id: 'nameRequired', message: 'Name is required' };

      group.setValidators([nameRequired]);

      expect(group.errors[0]?.id).toBe('nameRequired');
    });
  });

  describe('setResource', () => {
    it('should replace the resource of the group', () => {
      const group = formArrayGroup<
        { name: FormArrayControl<string> },
        { id: number }
      >({
        controls: { name: formArrayControl('rolster') }
      });

      group.setResource({ id: 10 });

      expect(group.resource).toEqual({ id: 10 });
      expect(group.signals.resource()).toEqual({ id: 10 });
    });
  });

  describe('reset', () => {
    it('should restore the state of all its controls', () => {
      const group = formArrayGroup({
        controls: { name: formArrayControl('rolster') }
      });

      group.controls.name.setValue('angular');
      group.reset();

      expect(group.value).toEqual({ name: 'rolster' });
      expect(group.dirty).toBe(false);
      expect(group.touched).toBe(false);
    });
  });
});

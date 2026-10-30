import { computed } from '@angular/core';
import { ValidatorGroupFn } from '@rolster/forms';
import { ValidatorFn } from '@rolster/validators';
import { formControl } from '../form-control/form-control';
import { AngularHtmlControl } from '../form-control/form-control.type';
import { formGroup } from './form-group';

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

interface CredentialsControls {
  confirmation: AngularHtmlControl<string>;
  password: AngularHtmlControl<string>;
  [key: string]: AngularHtmlControl<string>;
}

const credentialsMatch: ValidatorGroupFn<CredentialsControls> = ({
  confirmation,
  password
}) =>
  password.value === confirmation.value
    ? undefined
    : { id: 'credentialsMatch', message: 'Credentials do not match' };

function createCredentialsGroup(
  validators?: ValidatorGroupFn<CredentialsControls>[]
) {
  const password = formControl<string>('');
  const confirmation = formControl<string>('');

  const group = formGroup<CredentialsControls>(
    { confirmation, password },
    validators
  );

  return { confirmation, group, password };
}

describe('formGroup', () => {
  describe('initial state', () => {
    it('should aggregate the value of all its controls', () => {
      const group = formGroup({
        name: formControl('rolster'),
        version: formControl(22)
      });

      expect(group.value).toEqual({ name: 'rolster', version: 22 });
      expect(group.dirty).toBe(false);
      expect(group.touched).toBe(false);
      expect(group.valid).toBe(true);
      expect(group.wrong).toBe(false);
    });

    it('should be invalid when some control is invalid', () => {
      const group = formGroup({
        email: formControl('rolster@mail.com'),
        name: formControl('', [required])
      });

      expect(group.valid).toBe(false);
      expect(group.invalid).toBe(true);
    });

    it('should expose its controls', () => {
      const group = formGroup({ name: formControl('rolster') });

      expect(group.controls.name.value).toBe('rolster');
    });

    it('should accept an options object', () => {
      const { group } = createCredentialsGroup();
      const withOptions = formGroup({
        controls: group.controls,
        validators: [credentialsMatch]
      });

      expect(withOptions.validators?.length).toBe(1);
    });
  });

  describe('controls synchronization', () => {
    it('should update the group value when a control value changes', () => {
      const { group, password } = createCredentialsGroup();

      password.setValue('rolster');

      expect(group.value).toEqual({ confirmation: '', password: 'rolster' });
    });

    it('should recalculate validity when a control value changes', () => {
      const name = formControl<string>('', [required]);
      const group = formGroup({ name });

      expect(group.valid).toBe(false);

      name.setValue('rolster');

      expect(group.valid).toBe(true);
    });

    it('should be dirty when some control is dirty and dirties when all are', () => {
      const { confirmation, group, password } = createCredentialsGroup();

      password.setValue('rolster');

      expect(group.dirty).toBe(true);
      expect(group.dirties).toBe(false);
      expect(group.pristine).toBe(false);

      confirmation.setValue('rolster');

      expect(group.dirties).toBe(true);
      expect(group.pristines).toBe(false);
    });

    it('should be touched when some control is touched and toucheds when all are', () => {
      const { confirmation, group, password } = createCredentialsGroup();

      password.touch();

      expect(group.touched).toBe(true);
      expect(group.toucheds).toBe(false);

      confirmation.touch();

      expect(group.toucheds).toBe(true);
      expect(group.untoucheds).toBe(false);
    });

    it('should ignore disabled controls in the aggregated flags', () => {
      const { confirmation, group, password } = createCredentialsGroup();

      password.setValue('rolster');
      confirmation.disable();

      expect(group.dirties).toBe(true);
    });
  });

  describe('group validators', () => {
    it('should evaluate validators over all the controls', () => {
      const { confirmation, group, password } = createCredentialsGroup([
        credentialsMatch
      ]);

      expect(group.valid).toBe(true);

      password.setValue('rolster');

      expect(group.valid).toBe(false);
      expect(group.error?.id).toBe('credentialsMatch');

      confirmation.setValue('rolster');

      expect(group.valid).toBe(true);
    });

    it('should be wrong only when the group is touched and invalid', () => {
      const { group, password } = createCredentialsGroup([credentialsMatch]);

      password.setValue('rolster');

      expect(group.wrong).toBe(false);

      password.touch();

      expect(group.wrong).toBe(true);
    });

    it('should not run the validators when a control interaction state changes', () => {
      let executions = 0;

      const countingValidator: ValidatorGroupFn<CredentialsControls> = () => {
        executions++;

        return undefined;
      };

      const { group, password } = createCredentialsGroup([countingValidator]);

      expect(group.valid).toBe(true);

      const initialExecutions = executions;

      password.focus();
      password.touch();

      expect(group.valid).toBe(true);
      expect(executions).toBe(initialExecutions);
    });

    it('should run the validators when a control value changes', () => {
      let executions = 0;

      const countingValidator: ValidatorGroupFn<CredentialsControls> = () => {
        executions++;

        return undefined;
      };

      const { group, password } = createCredentialsGroup([countingValidator]);

      expect(group.valid).toBe(true);

      const initialExecutions = executions;

      password.setValue('rolster');

      expect(group.valid).toBe(true);
      expect(executions).toBeGreaterThan(initialExecutions);
    });

    it('should revalidate the controls with setValidators', () => {
      const { group, password } = createCredentialsGroup();

      password.setValue('rolster');

      expect(group.valid).toBe(true);

      group.setValidators([credentialsMatch]);

      expect(group.valid).toBe(false);
    });
  });

  describe('setValue', () => {
    it('should set the value of the controls declared in the partial value', () => {
      const { confirmation, group, password } = createCredentialsGroup();

      group.setValue({ password: 'rolster' });

      expect(password.value).toBe('rolster');
      expect(confirmation.value).toBe('');
      expect(group.value).toEqual({ confirmation: '', password: 'rolster' });
    });
  });

  describe('signals', () => {
    it('should expose the value as a signal', () => {
      const { group, password } = createCredentialsGroup();

      expect(group.signal()).toEqual({ confirmation: '', password: '' });
      expect(group.signals.value).toBe(group.signal);

      password.setValue('rolster');

      expect(group.signal()).toEqual({ confirmation: '', password: 'rolster' });
    });

    it('should keep the same value reference when a control interaction state changes', () => {
      const { group, password } = createCredentialsGroup();

      const value = group.value;

      password.focus();

      expect(group.value).toBe(value);
    });

    it('should track the getters inside a computed', () => {
      const { group, password } = createCredentialsGroup([credentialsMatch]);

      const message = computed(() =>
        group.wrong ? group.error?.message : undefined
      );

      password.setValue('rolster');

      expect(message()).toBeUndefined();

      password.touch();

      expect(message()).toBe('Credentials do not match');
    });
  });

  describe('reset', () => {
    it('should reset all the controls of the group', () => {
      const { confirmation, group, password } = createCredentialsGroup();

      password.setValue('rolster');
      confirmation.setValue('angular');
      password.touch();
      group.reset();

      expect(group.value).toEqual({ confirmation: '', password: '' });
      expect(group.dirty).toBe(false);
      expect(group.touched).toBe(false);
    });
  });
});

import { ValidatorFn } from '@rolster/validators';
import {
  angularArrayControl,
  areaArrayControl,
  formArrayControl,
  inputArrayControl
} from './form-array-control';

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

describe('formArrayControl', () => {
  describe('initial state', () => {
    it('should create a pristine control', () => {
      const control = formArrayControl('rolster');

      expect(control.uuid).toBeDefined();
      expect(control.value).toBe('rolster');
      expect(control.dirty).toBe(false);
      expect(control.pristine).toBe(true);
      expect(control.touched).toBe(false);
      expect(control.untouched).toBe(true);
      expect(control.focused).toBe(false);
      expect(control.unfocused).toBe(true);
      expect(control.disabled).toBe(false);
      expect(control.enabled).toBe(true);
      expect(control.valid).toBe(true);
      expect(control.wrong).toBe(false);
    });

    it('should evaluate validators against the initial value', () => {
      const control = formArrayControl('', [required]);

      expect(control.valid).toBe(false);
      expect(control.invalid).toBe(true);
      expect(control.error?.id).toBe('required');
    });

    it('should create controls with unique uuid', () => {
      expect(formArrayControl('a').uuid).not.toBe(formArrayControl('a').uuid);
    });

    it('should use the given uuid and touched state', () => {
      const control = formArrayControl({
        touched: true,
        uuid: 'control-uuid',
        value: 'rolster'
      });

      expect(control.uuid).toBe('control-uuid');
      expect(control.touched).toBe(true);
    });
  });

  describe('setValue', () => {
    it('should mark the control as dirty with the value revalidated', () => {
      const control = formArrayControl<string>('', [required]);

      control.setValue('rolster');

      expect(control.value).toBe('rolster');
      expect(control.dirty).toBe(true);
      expect(control.valid).toBe(true);
    });

    it('should not change the state when the value does not change', () => {
      const control = formArrayControl('rolster');

      control.setValue('rolster');

      expect(control.dirty).toBe(false);
    });
  });

  describe('setStartValue', () => {
    it('should update the value without marking the control as dirty', () => {
      const control = formArrayControl('');

      control.setStartValue('rolster');

      expect(control.value).toBe('rolster');
      expect(control.dirty).toBe(false);
    });
  });

  describe('setDefaultValue', () => {
    it('should update the value and the default value used by reset', () => {
      const control = formArrayControl<string>('rolster');

      control.setDefaultValue('react');

      expect(control.value).toBe('react');

      control.setValue('angular');
      control.reset();

      expect(control.value).toBe('react');
    });
  });

  describe('interaction state', () => {
    it('should be focused on focus and touched on blur', () => {
      const control = formArrayControl('');

      control.focus();

      expect(control.focused).toBe(true);

      control.blur();

      expect(control.focused).toBe(false);
      expect(control.touched).toBe(true);
    });

    it('should toggle the disabled state with disable and enable', () => {
      const control = formArrayControl('');

      control.disable();

      expect(control.disabled).toBe(true);
      expect(control.enabled).toBe(false);

      control.enable();

      expect(control.disabled).toBe(false);
    });
  });

  describe('setValidators', () => {
    it('should revalidate the current value', () => {
      const control = formArrayControl('');

      expect(control.valid).toBe(true);

      control.setValidators([required]);

      expect(control.valid).toBe(false);
    });
  });

  describe('reset', () => {
    it('should restore the default value and clear dirty and touched', () => {
      const control = formArrayControl('rolster');

      control.setValue('angular');
      control.touch();
      control.reset();

      expect(control.value).toBe('rolster');
      expect(control.dirty).toBe(false);
      expect(control.touched).toBe(false);
    });
  });

  describe('errors verification', () => {
    it('should verify errors with hasError and someErrors', () => {
      const control = formArrayControl('', [required]);

      expect(control.hasError('required')).toBe(true);
      expect(control.hasError('email')).toBe(false);
      expect(control.someErrors(['email', 'required'])).toBe(true);
      expect(control.someErrors(['email', 'pattern'])).toBe(false);
    });
  });
});

describe('angularArrayControl', () => {
  it('should create a control with generic element type', () => {
    const control = angularArrayControl<string, HTMLInputElement>('rolster');

    expect(control.value).toBe('rolster');
    expect(control.valid).toBe(true);
  });
});

describe('inputArrayControl', () => {
  it('should create a control for input elements', () => {
    const control = inputArrayControl('rolster');

    expect(control.value).toBe('rolster');
  });
});

describe('areaArrayControl', () => {
  it('should create a control for textarea elements', () => {
    const control = areaArrayControl('rolster', [required]);

    expect(control.value).toBe('rolster');
    expect(control.valid).toBe(true);
  });
});

describe('formArrayControl formatter', () => {
  const upperCase = (value: string) => value.toUpperCase();
  const onlyDigits = (value: string) => value.replace(/\D/g, '');

  it('should format the initial value and expose the formatter', () => {
    const control = formArrayControl({ formatter: upperCase, value: 'abc' });

    expect(control.value).toBe('ABC');
    expect(control.formatter).toBe(upperCase);
  });

  it('should format on setValue', () => {
    const control = formArrayControl({ formatter: upperCase, value: '' });

    control.setValue('abc');

    expect(control.value).toBe('ABC');
    expect(control.dirty).toBe(true);
  });

  it('should keep the state when the formatter rejects the input', () => {
    const control = formArrayControl({ formatter: onlyDigits, value: '12' });

    control.setValue('12a');

    expect(control.value).toBe('12');
    expect(control.dirty).toBe(false);
  });

  it("should format on blur when formatOn is 'blur'", () => {
    const control = formArrayControl({
      formatOn: 'blur',
      formatter: upperCase,
      validators: [required],
      value: ''
    });

    control.focus();
    control.setValue('abc');

    expect(control.value).toBe('abc');

    control.blur();

    expect(control.value).toBe('ABC');
    expect(control.touched).toBe(true);
    expect(control.focused).toBe(false);
    expect(control.valid).toBe(true);
  });
});

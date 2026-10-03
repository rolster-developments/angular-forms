import { ValidatorFn } from '@rolster/validators';
import { formArrayControl } from '../form-array/form-array-control';
import { formControl } from './form-control';

const upperCase = (value: string) => value.toUpperCase();
const onlyDigits = (value: string) => value.replace(/\D/g, '');

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

describe('FormControl formatter', () => {
  describe("formatOn 'input' (default)", () => {
    it('should expose the formatter options', () => {
      const control = formControl({ formatter: upperCase, value: 'abc' });

      expect(control.formatter).toBe(upperCase);
      expect(control.formatOn).toBeUndefined();
    });

    it('should format the initial value', () => {
      const control = formControl({ formatter: upperCase, value: 'abc' });

      expect(control.value).toBe('ABC');
      expect(control.signal()).toBe('ABC');
    });

    it('should format the value on setValue and mark the control as dirty', () => {
      const control = formControl({ formatter: upperCase, value: '' });

      control.setValue('abc');

      expect(control.value).toBe('ABC');
      expect(control.dirty()).toBe(true);
    });

    it('should keep the previous value when the formatter rejects the input', () => {
      const control = formControl({ formatter: onlyDigits, value: '12' });

      control.setValue('12a');

      expect(control.value).toBe('12');
    });

    it('should run validators against the formatted value', () => {
      const control = formControl({
        formatter: onlyDigits,
        validators: [required],
        value: '1'
      });

      expect(control.valid()).toBe(true);

      control.setValue('abc');

      expect(control.value).toBe('');
      expect(control.valid()).toBe(false);
      expect(control.error()?.id).toBe('required');
    });

    it('should format setStartValue, setDefaultValue and reset', () => {
      const control = formControl({ formatter: upperCase, value: '' });

      control.setStartValue('start');

      expect(control.value).toBe('START');

      control.setDefaultValue('default');
      control.setValue('other');
      control.reset();

      expect(control.value).toBe('DEFAULT');
    });

    it('should not format on blur', () => {
      const control = formControl({ formatter: upperCase, value: 'ABC' });

      control.blur();

      expect(control.value).toBe('ABC');
      expect(control.touched()).toBe(true);
    });
  });

  describe("formatOn 'blur'", () => {
    it('should keep the raw value while typing and format on blur', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: upperCase,
        value: ''
      });

      control.setValue('abc');

      expect(control.value).toBe('abc');

      control.blur();

      expect(control.value).toBe('ABC');
      expect(control.touched()).toBe(true);
      expect(control.focused()).toBe(false);
    });

    it('should revalidate the formatted value on blur', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: onlyDigits,
        validators: [required],
        value: ''
      });

      control.setValue('abc');

      expect(control.valid()).toBe(true);

      control.blur();

      expect(control.value).toBe('');
      expect(control.valid()).toBe(false);
      expect(control.wrong()).toBe(true);
    });

    it('should not format the initial, start or default value', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: upperCase,
        value: 'abc'
      });

      expect(control.value).toBe('abc');

      control.setStartValue('start');

      expect(control.value).toBe('start');

      control.setDefaultValue('default');

      expect(control.value).toBe('default');
    });
  });

  describe('without formatter', () => {
    it('should behave as before', () => {
      const control = formControl('abc');

      control.setValue('xyz');
      control.blur();

      expect(control.value).toBe('xyz');
      expect(control.formatter).toBeUndefined();
    });
  });
});

describe('FormArrayControl formatter', () => {
  it('should inherit the formatter behaviour', () => {
    const control = formArrayControl({ formatter: upperCase, value: 'abc' });

    expect(control.value).toBe('ABC');

    control.setValue('xyz');

    expect(control.value).toBe('XYZ');
    expect(control.formatter).toBe(upperCase);
  });
});

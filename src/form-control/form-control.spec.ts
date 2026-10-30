import { computed } from '@angular/core';
import { ValidatorFn } from '@rolster/validators';
import {
  angularControl,
  areaControl,
  formControl,
  inputControl
} from './form-control';

const required: ValidatorFn<string> = (value) =>
  value ? undefined : { id: 'required', message: 'Value is required' };

const minLength3: ValidatorFn<string> = (value) =>
  value && value.length >= 3
    ? undefined
    : { id: 'minLength', message: 'Value requires at least 3 characters' };

describe('formControl', () => {
  describe('initial state', () => {
    it('should create a pristine control without arguments', () => {
      const control = formControl<string>();

      expect(control.value).toBeUndefined();
      expect(control.dirty).toBe(false);
      expect(control.pristine).toBe(true);
      expect(control.touched).toBe(false);
      expect(control.untouched).toBe(true);
      expect(control.focused).toBe(false);
      expect(control.unfocused).toBe(true);
      expect(control.disabled).toBe(false);
      expect(control.enabled).toBe(true);
      expect(control.valid).toBe(true);
      expect(control.invalid).toBe(false);
      expect(control.wrong).toBe(false);
      expect(control.errors).toEqual([]);
      expect(control.error).toBeUndefined();
    });

    it('should create a control with initial value', () => {
      const control = formControl('rolster');

      expect(control.value).toBe('rolster');
    });

    it('should evaluate validators against the initial value', () => {
      const control = formControl('', [required]);

      expect(control.valid).toBe(false);
      expect(control.invalid).toBe(true);
      expect(control.error?.id).toBe('required');
    });

    it('should create a control from an options object', () => {
      const control = formControl({
        touched: true,
        validators: [required],
        value: 'ok'
      });

      expect(control.value).toBe('ok');
      expect(control.touched).toBe(true);
      expect(control.valid).toBe(true);
      expect(control.validators?.length).toBe(1);
    });
  });

  describe('setValue', () => {
    it('should update the value and mark the control as dirty', () => {
      const control = formControl<string>('');

      control.setValue('angular');

      expect(control.value).toBe('angular');
      expect(control.dirty).toBe(true);
      expect(control.pristine).toBe(false);
    });

    it('should revalidate the value on each change', () => {
      const control = formControl<string>('', [required]);

      control.setValue('angular');

      expect(control.valid).toBe(true);

      control.setValue('');

      expect(control.valid).toBe(false);
      expect(control.error?.id).toBe('required');
    });
  });

  describe('functional setValue', () => {
    it('should update the value from the current value with an updater', () => {
      const control = formControl(10);

      control.setValue((current) => current + 5);

      expect(control.value).toBe(15);
      expect(control.dirty).toBe(true);
    });

    it('should apply all the updaters called in sequence', () => {
      const control = formControl(10);

      control.setValue((current) => current + 1);
      control.setValue((current) => current + 1);

      expect(control.value).toBe(12);
    });

    it('should not change the state when the value does not change', () => {
      const control = formControl('rolster');

      control.setValue('rolster');

      expect(control.dirty).toBe(false);

      control.setValue((current) => current);

      expect(control.dirty).toBe(false);
    });
  });

  describe('setStartValue', () => {
    it('should update the value without marking the control as dirty', () => {
      const control = formControl<string>('', [required]);

      control.setStartValue('angular');

      expect(control.value).toBe('angular');
      expect(control.dirty).toBe(false);
      expect(control.valid).toBe(true);
    });
  });

  describe('reset', () => {
    it('should restore the initial value and clear dirty and touched', () => {
      const control = formControl('rolster');

      control.setValue('angular');
      control.touch();
      control.reset();

      expect(control.value).toBe('rolster');
      expect(control.dirty).toBe(false);
      expect(control.touched).toBe(false);
    });

    it('should restore the value defined with setDefaultValue', () => {
      const control = formControl('rolster');

      control.setDefaultValue('react');
      control.setValue('angular');
      control.reset();

      expect(control.value).toBe('react');
    });
  });

  describe('interaction state', () => {
    it('should mark the control as focused on focus', () => {
      const control = formControl('');

      control.focus();

      expect(control.focused).toBe(true);
      expect(control.unfocused).toBe(false);
    });

    it('should mark the control as touched and unfocused on blur', () => {
      const control = formControl('');

      control.focus();
      control.blur();

      expect(control.focused).toBe(false);
      expect(control.touched).toBe(true);
    });

    it('should mark the control as touched on touch', () => {
      const control = formControl('');

      control.touch();

      expect(control.touched).toBe(true);
      expect(control.untouched).toBe(false);
    });

    it('should toggle the disabled state with disable and enable', () => {
      const control = formControl('');

      control.disable();

      expect(control.disabled).toBe(true);
      expect(control.enabled).toBe(false);

      control.enable();

      expect(control.disabled).toBe(false);
      expect(control.enabled).toBe(true);
    });
  });

  describe('validation state', () => {
    it('should be wrong only when the control is touched and invalid', () => {
      const control = formControl<string>('', [required]);

      expect(control.wrong).toBe(false);

      control.touch();

      expect(control.wrong).toBe(true);

      control.setValue('angular');

      expect(control.wrong).toBe(false);
    });

    it('should collect the errors of all failing validators', () => {
      const control = formControl('', [required, minLength3]);

      expect(control.errors.length).toBe(2);
      expect(control.error?.id).toBe('required');
    });

    it('should revalidate the current value with setValidators', () => {
      const control = formControl('');

      expect(control.valid).toBe(true);

      control.setValidators([required]);

      expect(control.valid).toBe(false);

      control.setValidators(undefined);

      expect(control.valid).toBe(true);
    });

    it('should verify errors with hasError and someErrors', () => {
      const control = formControl('', [required, minLength3]);

      expect(control.hasError('required')).toBe(true);
      expect(control.hasError('email')).toBe(false);
      expect(control.someErrors(['email', 'minLength'])).toBe(true);
      expect(control.someErrors(['email', 'pattern'])).toBe(false);
    });
  });

  describe('signals', () => {
    it('should expose the value as a signal', () => {
      const control = formControl('rolster');

      expect(control.signal()).toBe('rolster');
      expect(control.signals.value).toBe(control.signal);

      control.setValue('angular');

      expect(control.signal()).toBe('angular');
    });

    it('should expose every state as a signal', () => {
      const control = formControl<string>('', [required]);

      expect(control.signals.dirty()).toBe(false);
      expect(control.signals.valid()).toBe(false);
      expect(control.signals.error()?.id).toBe('required');

      control.setValue('angular');
      control.blur();

      expect(control.signals.dirty()).toBe(true);
      expect(control.signals.touched()).toBe(true);
      expect(control.signals.valid()).toBe(true);
      expect(control.signals.errors()).toEqual([]);
    });

    it('should track the getters inside a computed', () => {
      const control = formControl<string>('', [required]);

      const message = computed(() =>
        control.wrong ? control.error?.message : undefined
      );

      expect(message()).toBeUndefined();

      control.touch();

      expect(message()).toBe('Value is required');

      control.setValue('angular');

      expect(message()).toBeUndefined();
    });

    it('should keep the same control reference across changes', () => {
      const control = formControl<string>('');
      const { blur, setValue } = control;

      control.setValue('angular');

      expect(control.blur).toBe(blur);
      expect(control.setValue).toBe(setValue);
    });
  });
});

const upperCase = (value: string) => value.toUpperCase();
const onlyDigits = (value: string) => value.replace(/\D/g, '');

describe('formControl formatter', () => {
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
      expect(control.dirty).toBe(true);
    });

    it('should format the value produced by an updater', () => {
      const control = formControl({ formatter: upperCase, value: 'a' });

      control.setValue((current) => `${current}b`);

      expect(control.value).toBe('AB');
    });

    it('should not change the state when the formatter rejects the input', () => {
      const control = formControl({ formatter: onlyDigits, value: '12' });

      control.setValue('12a');

      expect(control.value).toBe('12');
      expect(control.dirty).toBe(false);
    });

    it('should run validators against the formatted value', () => {
      const control = formControl({
        formatter: onlyDigits,
        validators: [required],
        value: '1'
      });

      expect(control.valid).toBe(true);

      control.setValue('abc');

      expect(control.value).toBe('');
      expect(control.valid).toBe(false);
    });

    it('should format setStartValue, setDefaultValue and reset', () => {
      const control = formControl({ formatter: upperCase, value: '' });

      control.setStartValue('start');

      expect(control.value).toBe('START');
      expect(control.dirty).toBe(false);

      control.setDefaultValue('default');
      control.setValue('other');
      control.reset();

      expect(control.value).toBe('DEFAULT');
    });

    it('should not format on blur', () => {
      const control = formControl({ formatter: upperCase, value: 'ABC' });

      control.blur();

      expect(control.value).toBe('ABC');
      expect(control.touched).toBe(true);
    });
  });

  describe("formatOn 'blur'", () => {
    it('should keep the raw value while typing and format on blur', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: upperCase,
        validators: [required],
        value: ''
      });

      control.setValue('abc');

      expect(control.value).toBe('abc');

      control.blur();

      expect(control.value).toBe('ABC');
      expect(control.touched).toBe(true);
      expect(control.focused).toBe(false);
      expect(control.valid).toBe(true);
    });

    it('should revalidate the formatted value on blur', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: onlyDigits,
        validators: [required],
        value: ''
      });

      control.setValue('abc');

      expect(control.valid).toBe(true);

      control.blur();

      expect(control.value).toBe('');
      expect(control.valid).toBe(false);
      expect(control.wrong).toBe(true);
    });

    it('should not format the initial or start value', () => {
      const control = formControl({
        formatOn: 'blur',
        formatter: upperCase,
        value: 'abc'
      });

      expect(control.value).toBe('abc');

      control.setStartValue('start');

      expect(control.value).toBe('start');
    });
  });
});

describe('angularControl', () => {
  it('should create a control without element reference', () => {
    const control = angularControl<string, HTMLInputElement>('rolster');

    expect(control.value).toBe('rolster');
    expect(control.elementRef).toBeUndefined();
  });
});

describe('inputControl', () => {
  it('should create a control for input elements', () => {
    const control = inputControl('rolster');

    expect(control.value).toBe('rolster');
    expect(control.valid).toBe(true);
  });
});

describe('areaControl', () => {
  it('should create a control for textarea elements', () => {
    const control = areaControl('rolster', [required]);

    expect(control.value).toBe('rolster');
    expect(control.valid).toBe(true);
  });
});

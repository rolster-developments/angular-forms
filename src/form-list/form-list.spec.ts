import { computed } from '@angular/core';
import { ValidatorFn } from '@rolster/validators';
import { angularList, formList } from './form-list';

const minTwoItems: ValidatorFn<string[]> = (value) =>
  value && value.length >= 2
    ? undefined
    : { id: 'minItems', message: 'List requires at least 2 items' };

describe('formList', () => {
  it('should create a list with an empty array by default', () => {
    const list = formList<string>();

    expect(list.value).toEqual([]);
    expect(list.dirty).toBe(false);
    expect(list.valid).toBe(true);
  });

  it('should create a list with the initial value', () => {
    const list = formList(['react', 'angular']);

    expect(list.value).toEqual(['react', 'angular']);
  });

  describe('push', () => {
    it('should add the item to the list and mark it as dirty', () => {
      const list = formList<string>();

      list.push('react');

      expect(list.value).toEqual(['react']);
      expect(list.dirty).toBe(true);

      list.push('angular');

      expect(list.value).toEqual(['react', 'angular']);
    });
  });

  describe('remove', () => {
    it('should remove the item from the list', () => {
      const list = formList(['react', 'angular']);

      list.remove('react');

      expect(list.value).toEqual(['angular']);
    });

    it('should not change the state when the item does not exist', () => {
      const list = formList(['react']);

      list.remove('angular');

      expect(list.value).toEqual(['react']);
      expect(list.dirty).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all the items from the list', () => {
      const list = formList(['react', 'angular']);

      list.clear();

      expect(list.value).toEqual([]);
      expect(list.dirty).toBe(true);
    });

    it('should not change the state when the list is empty', () => {
      const list = formList<string>();

      list.clear();

      expect(list.value).toEqual([]);
      expect(list.dirty).toBe(false);
    });
  });

  describe('validators', () => {
    it('should evaluate validators over the list value', () => {
      const list = formList(['react'], [minTwoItems]);

      expect(list.valid).toBe(false);
      expect(list.error?.id).toBe('minItems');

      list.push('angular');

      expect(list.valid).toBe(true);
    });
  });

  describe('signals', () => {
    it('should track the list value inside a computed', () => {
      const list = formList<string>();
      const size = computed(() => list.value.length);

      list.push('react');

      expect(size()).toBe(1);
      expect(list.signal()).toEqual(['react']);
    });
  });
});

describe('angularList', () => {
  it('should create a list without element reference', () => {
    const list = angularList<string, HTMLElement>(['react']);

    expect(list.value).toEqual(['react']);
    expect(list.elementRef).toBeUndefined();
  });
});

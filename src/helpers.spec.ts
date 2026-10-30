import { formControl } from './form-control/form-control';
import { formGroup } from './form-group/form-group';
import { reduceControlsToValues, reduceGroupToValues } from './helpers';

describe('reduceControlsToValues', () => {
  it('should reduce the controls to an array of values', () => {
    const language = formControl('typescript');
    const name = formControl('rolster');

    expect(reduceControlsToValues({ language, name })).toEqual([
      'typescript',
      'rolster'
    ]);
  });
});

describe('reduceGroupToValues', () => {
  it('should reduce the controls of a group to an array of values', () => {
    const group = formGroup({
      language: formControl('typescript'),
      name: formControl('rolster')
    });

    expect(reduceGroupToValues(group)).toEqual(['typescript', 'rolster']);
  });
});

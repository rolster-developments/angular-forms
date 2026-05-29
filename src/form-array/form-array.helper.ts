import { parseBoolean } from '@rolster/commons';
import { ValidatorError } from '@rolster/validators';
import {
  AbstractAngularArrayControls,
  AbstractAngularArrayGroup
} from './form-array-group.type';
import { AngularFormArrayOptions, ValidatorArrayFn } from './form-array.type';
import {
  AbstractAngularControls,
  AbstractAngularFormGroup
} from '../form-group/form-group.type';

type ArrayArgsOptions<
  C extends AbstractAngularArrayControls,
  R,
  G extends AbstractAngularArrayGroup<C, R>
> = [
  Undefined<
    AngularFormArrayOptions<C, R, G> | AbstractAngularArrayGroup<C, R>[]
  >,
  Undefined<ValidatorArrayFn<C, R, G>[]>
];

interface ArrayValidOptions<
  T extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any,
  G extends AbstractAngularArrayGroup<T, R> = AbstractAngularArrayGroup<T, R>
> {
  groups: G[];
  validators: ValidatorArrayFn<T, R>[];
}

function valueIsArrayOptions<
  C extends AbstractAngularArrayControls,
  R,
  G extends AbstractAngularArrayGroup<C, R>,
  O extends AngularFormArrayOptions<C, R, G>
>(value: any): value is O {
  return (
    typeof value === 'object' && ('groups' in value || 'validators' in value)
  );
}

export function createFormArrayOptions<
  C extends AbstractAngularArrayControls,
  R,
  G extends AbstractAngularArrayGroup<C, R>,
  O extends AngularFormArrayOptions<C, R, G>
>(...arrayOptions: ArrayArgsOptions<C, R, G>): O {
  const [options, validators] = arrayOptions;

  if (!options) {
    return { groups: options, validators } as O;
  }

  if (!validators && valueIsArrayOptions<C, R, G, O>(options)) {
    return options;
  }

  return {
    groups: options as AbstractAngularArrayGroup<C, R>[],
    validators
  } as O;
}

export const formArrayIsValid = <
  C extends AbstractAngularArrayControls = AbstractAngularArrayControls,
  R = any
>({
  groups,
  validators
}: ArrayValidOptions<C, R>): ValidatorError[] => {
  return validators.reduce((errors, validator) => {
    const error = validator(groups);

    error && errors.push(error);

    return errors;
  }, [] as ValidatorError[]);
};

export function verifyAllTrueInGroup<C extends AbstractAngularControls>(
  groups: AbstractAngularFormGroup<C>[],
  key: keyof AbstractAngularFormGroup<C>
): boolean {
  return groups.reduce(
    (value, group) => value && parseBoolean(group[key]),
    true
  );
}

export function verifyAnyTrueInGroup<C extends AbstractAngularControls>(
  groups: AbstractAngularFormGroup<C>[],
  key: keyof AbstractAngularFormGroup<C>
): boolean {
  return groups.reduce(
    (value, group) => value || parseBoolean(group[key]),
    false
  );
}

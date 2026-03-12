import { ValidatorError } from "@rolster/validators";

export const groupIsValid = <C extends AbstractAngularControls>({
  controls,
  validators
}: GroupValidOptions<C>): ValidatorError[] => {
  return validators.reduce((errors, validator) => {
    const error = validator(controls);

    if (error) {
      errors.push(error);
    }

    return errors;
  }, [] as ValidatorError[]);
};

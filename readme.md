# Rolster Angular Forms

It implements a set of classes that allow managing the control of states of the input components in Angular.

## Installation

```
npm i @rolster/angular-forms
```

Requires **Angular 20 or higher** (`^20 || ^21 || ^22`) and **Node 24 or higher**.

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Features

The Angular binding of [`@rolster/forms`](https://www.npmjs.com/package/@rolster/forms). It keeps the same vocabulary — **controls**, **groups**, **arrays** and **lists** — and the same validators from [`@rolster/validators`](https://www.npmjs.com/package/@rolster/validators), and it exposes **the same interface as [`@rolster/react-forms`](https://www.npmjs.com/package/@rolster/react-forms)**: every state member (`value`, `errors`, `valid`, `dirty`, `touched`, `disabled`, …) is a plain readonly property, so the code that reads a control is identical in both frameworks.

Under the hood every member is backed by a **signal**. The getters read the signal, so a template, a `computed` or an `effect` that reads `control.valid` is tracked and reacts automatically; there is no `subscribe` to manage, and `ChangeDetectionStrategy.OnPush` and zoneless applications work without any extra setup. When you need the signal itself — to pass it to `toObservable`, an `input()` or a `linkedSignal` — every building block exposes `signal` (its value) and `signals` (every state).

There is nothing to import into a module: no `NgModule`, no directives, no providers. The building blocks are plain classes you instantiate as a field of the component.

Each building block has a class and a matching factory function (the factory is the recommended way to create them):

| Class                  | Factory                | Purpose                                         |
| ---------------------- | ---------------------- | ----------------------------------------------- |
| `FormControl`          | `formControl()`        | A single field                                  |
| `FormGroup`            | `formGroup()`          | A set of named controls (a form)                |
| `FormList`             | `formList()`           | A control whose value is a list of items        |
| `FormArray`            | `formArray()`          | A dynamic list of group items                   |
| `FormArrayGroup`       | `formArrayGroup()`     | A group item inside a `FormArray`               |
| `FormArrayControl`     | `formArrayControl()`   | A control (with `uuid`) inside a group item     |
| `FormArrayList`        | `formArrayList()`      | A control whose value is a list of control sets |
| `FormArrayGroupSelect` | `formArrayGroupSelect` | The selection of one group of a `FormArray`     |

### Controls

A control holds a value, its validators and a rich set of state members. Both the constructor and the factory accept an options object (`{ value, validators?, touched?, formatter?, formatOn? }`), the positional `(value, validators?)` pair, or nothing at all — in which case the value type is `T | undefined` (the `FormVoid<T>` alias).

| Member                   | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `value`                  | `T`: the current value                                             |
| `errors` / `error`       | `ValidatorError[]` of the failed validators / the first one        |
| `valid` / `invalid`      | Whether every validator passes                                     |
| `dirty` / `pristine`     | Whether the value was changed through `setValue`                   |
| `touched` / `untouched`  | Whether the field was interacted with (`touch()` / `blur()`)       |
| `focused` / `unfocused`  | Whether the field is focused (`focus()` / `blur()`)                |
| `disabled` / `enabled`   | Whether the control is disabled                                    |
| `wrong`                  | `touched && invalid`, ideal for showing an error in a template     |
| `validators`             | The current validators                                             |
| `formatter` / `formatOn` | The formatter options the control was created with                 |
| `signal`                 | `Signal<T>` with the current value                                 |
| `signals`                | `ControlSignals<T>`: a `Signal` for every member of this table     |
| `elementRef`             | Optional `ElementRef<E>` a field component can attach to the input |

**Methods:** `setValue(value)` (marks the control dirty; accepts a value or an updater `(current) => next`), `setStartValue(value)` (updates the value without marking it dirty), `setDefaultValue(value)` (also replaces the value restored by `reset()`), `setValidators(validators)`, `reset()`, `disable()` / `enable()`, `focus()` / `blur()`, `touch()`, `hasError(id)`, `someErrors(ids)`.

`setValue` compares with `Object.is`: when the value does not change the control stays pristine and nothing re-renders.

There are four factories, one per element type the control is meant to be attached to, exactly like the React hooks:

| Factory                  | Element               | Type                                       |
| ------------------------ | --------------------- | ------------------------------------------ |
| `formControl<T>()`       | `HTMLElement`         | `FormControl<T>`                           |
| `inputControl<T>()`      | `HTMLInputElement`    | `FormControl<T, HTMLInputElement>`         |
| `areaControl()`          | `HTMLTextAreaElement` | `FormControl<string, HTMLTextAreaElement>` |
| `angularControl<T, E>()` | `E`                   | `FormControl<T, E>`                        |

```typescript
import { computed } from '@angular/core';
import { formControl } from '@rolster/angular-forms';
import { email, required } from '@rolster/validators/helpers';

const emailControl = formControl('', [required, email]);

emailControl.value; // ''
emailControl.valid; // false
emailControl.error; // { id: 'required', message: 'Field is required' }

emailControl.setValue('daniel@rolster.com');
emailControl.valid; // true

emailControl.setValue((current) => current.trim());

// The getters read signals, so they compose with the rest of Angular
const message = computed(() =>
  emailControl.wrong ? emailControl.error?.message : undefined
);

// And the signals themselves are there when you need the object
emailControl.signal(); // 'daniel@rolster.com'
emailControl.signals.valid(); // true
```

#### Formatter

`formatter` is a pure `(value: T) => T` function that normalizes the value before it reaches the control, so validators, `computed`s and templates always see the formatted result. `formatOn` decides when it runs: `'input'` (the default) applies it to the initial value and to every `setValue`, `setStartValue` and `setDefaultValue`; `'blur'` keeps the raw value while the user types and applies it when `blur()` is called. A formatter that rejects a character leaves the value untouched and the control pristine.

```typescript
import { formControl } from '@rolster/angular-forms';

const phone = formControl({
  value: '',
  formatter: (value: string) => value.replace(/\D/g, '')
});

phone.setValue('30a1');
phone.value; // '301'

const name = formControl({
  value: '',
  formatter: (value: string) => value.trim(),
  formatOn: 'blur'
});

name.setValue(' Ana ');
name.value; // ' Ana '
name.blur();
name.value; // 'Ana'
```

The function must be **idempotent**, because the field components apply it before writing the DOM and the control applies it again. `FormArrayControl` accepts the same two options.

### FormGroup

A group binds several named controls together and derives its aggregate state from them. It accepts a `FormGroupOptions<C>` (`{ controls, validators? }`) or the `(controls, validators?)` pair.

| Member                     | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `controls`                 | The controls record                                   |
| `value`                    | The `{ key: value }` object of the controls           |
| `errors` / `error`         | Errors of the group validators                        |
| `valid` / `invalid`        | Group validators pass **and** every control is valid  |
| `dirty` / `dirties`        | Any control / every control is dirty                  |
| `pristine` / `pristines`   | Negation of the two above                             |
| `touched` / `toucheds`     | Any control / every control was touched               |
| `untouched` / `untoucheds` | Negation of the two above                             |
| `wrong`                    | `touched && invalid`                                  |
| `validators`               | The current group validators                          |
| `signal` / `signals`       | `Signal` with the value / a `Signal` for every member |

**Methods:** `setValue(partial)` (shallow merge, forwarded to each control), `setValidators(validators)` and `reset()`. Disabled controls are ignored when the aggregate flags are calculated. Group validators run only when a value changes, not when a control is focused or touched.

```typescript
import { Component } from '@angular/core';
import { formControl, formGroup } from '@rolster/angular-forms';
import { email, required, strMinlength } from '@rolster/validators/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public readonly formLogin = formGroup({
    email: formControl('', [required, email]),
    password: formControl('', [required, strMinlength(8)])
  });

  public get controls() {
    return this.formLogin.controls;
  }

  public onSubmit(): void {
    const { email, password } = this.formLogin.value;

    this.authService.login(email, password);
  }
}
```

```html
<form (ngSubmit)="onSubmit()">
  <input
    type="email"
    [value]="controls.email.value"
    (blur)="controls.email.blur()"
    (focus)="controls.email.focus()"
    (input)="controls.email.setValue($any($event.target).value)"
  />
  @if (controls.email.wrong) {
  <span>{{ controls.email.error?.message }}</span>
  }

  <input
    type="password"
    [value]="controls.password.value"
    (blur)="controls.password.blur()"
    (input)="controls.password.setValue($any($event.target).value)"
  />

  <button type="submit" [disabled]="formLogin.invalid">Login</button>
  <button type="button" (click)="formLogin.reset()">Clear</button>
</form>
```

### FormList

A `FormList<T>` is a `FormControl<T[]>` with three list helpers: `push(item)`, `remove(item)` and `clear()`. The three go through `setValue`, so they mark the list dirty, run its validators and leave the state untouched when nothing changes (removing an item that is not there, clearing an empty list). The factory is `formList(value?, validators?)`; `angularList<T, E>()` fixes the element type.

```typescript
import { formList } from '@rolster/angular-forms';

const tags = formList<string>(['forms']);

tags.push('signals');
tags.value; // ['forms', 'signals']
tags.remove('forms');
tags.clear();
tags.dirty; // true
```

### FormArray

A `FormArray` manages a dynamic list of group items, perfect for repeatable sections such as "add another phone". Each item is a `FormArrayGroup` with a stable `uuid`, and its controls must be created with `formArrayControl` (a `FormControl` that also carries a `uuid`).

Besides the aggregate members of a group — `dirty`/`dirties`, `pristine`/`pristines`, `touched`/`toucheds`, `untouched`/`untoucheds`, `valid`/`invalid`, `errors`/`error`, `wrong`, `disabled`/`enabled` — it exposes `groups`, `controls`, `value`, `signal` and `signals`, plus the methods `push(group)`, `merge(groups)`, `remove(group)`, `findByUuid(uuid)`, `setValue(groups)`, `setStartValue(groups)`, `setDefaultValue(groups)`, `setValidators(validators)`, `disable()` / `enable()`, `hasError(id)`, `someErrors(ids)` and `reset()`.

`reset()` restores the default groups (the initial ones or the ones given to `setDefaultValue`) and resets every control of those groups.

```typescript
import { Component } from '@angular/core';
import {
  AngularArrayGroup,
  FormArrayControl,
  formArray,
  formArrayControl,
  formArrayGroup
} from '@rolster/angular-forms';
import { required } from '@rolster/validators/helpers';

type PhoneControls = {
  label: FormArrayControl<string>;
  number: FormArrayControl<string>;
};

@Component({
  selector: 'app-phones',
  templateUrl: './phones.component.html'
})
export class PhonesComponent {
  public readonly formPhones = formArray<PhoneControls>();

  public onAdd(): void {
    this.formPhones.push(
      formArrayGroup<PhoneControls>({
        controls: {
          label: formArrayControl('', [required]),
          number: formArrayControl('', [required])
        }
      })
    );
  }

  public onRemove(group: AngularArrayGroup<PhoneControls>): void {
    this.formPhones.remove(group);
  }
}
```

```html
@for (group of formPhones.groups; track group.uuid) {
<div>
  <input
    [value]="group.controls.number.value"
    (blur)="group.controls.number.blur()"
    (input)="group.controls.number.setValue($any($event.target).value)"
  />
  <button type="button" (click)="onRemove(group)">Remove</button>
</div>
}

<button type="button" (click)="onAdd()">Add phone</button>
<span>{{ formPhones.groups.length }} phones</span>
```

A `FormArrayGroup` can carry a typed `resource`: the original payload the item was built from, handy when mapping the group back to your domain model. It can be replaced later with `setResource`, and the group accepts its own `uuid` when the identity must survive a rebuild.

```typescript
const item = formArrayGroup({
  controls: { number: formArrayControl('3001234567') },
  resource: { id: 7 },
  uuid: 'phone-7'
});

item.resource; // { id: 7 }
item.setResource({ id: 8 });
item.uuid; // 'phone-7'
```

### FormArrayList

A `FormArrayList<C>` is a control whose value is a list of plain objects, each one backed by a set of `FormArrayControl`s built with the `valueToControls` function you provide. The factory takes an options object: `formArrayList({ valueToControls, value?, validators?, valueToUuid?, touched? })`.

Each set of controls gets a `uuid` (generated, or derived from the value through `valueToUuid`) exposed in `controlsUuid`, and `findControlsByUuid(uuid)` returns the set it identifies. `setValue`, `setStartValue`, `setDefaultValue` and `reset` rebuild the controls from the given values; `push(controls)` and `remove(controls)` add or drop one set. The list is valid when its own validators pass **and** every inner control is valid.

```typescript
import {
  FormArrayControl,
  formArrayControl,
  formArrayList
} from '@rolster/angular-forms';

type TagControls = {
  name: FormArrayControl<string>;
};

const tags = formArrayList<TagControls>({
  value: [{ name: 'forms' }],
  valueToControls: ({ name }) => ({ name: formArrayControl(name) }),
  valueToUuid: ({ name }) => name
});

tags.value; // [{ name: 'forms' }]
tags.push({ name: formArrayControl('signals') });
tags.controls.length; // 2
tags.findControlsByUuid('forms')?.name.value; // 'forms'
tags.remove(tags.controls[0]);
```

### FormArrayGroupSelect

`formArrayGroupSelect({ formArray })` keeps the selection of one group of a `FormArray`: `setFormGroup(group)` selects it, `formGroup` returns the current instance of that group (or `undefined` once it is removed from the array) and `signal` is the same as a `Signal`.

```typescript
const select = formArrayGroupSelect({ formArray: formPhones });

select.setFormGroup(formPhones.groups[0]);
select.formGroup?.value;
```

### Array factories

The array controls have the same four factories as the plain controls — `formArrayControl`, `inputArrayControl`, `areaArrayControl` and `angularArrayControl` — and accept the same options, plus an optional `uuid`.

### Helpers

`reduceControlsToValues(controls)` and `reduceGroupToValues(group)` return the values of a controls record or a group as an array, in the order of the keys.

### Validators

Validators are the plain functions of [`@rolster/validators`](https://www.npmjs.com/package/@rolster/validators): pass them to the control, either positionally or through the options object.

```typescript
import { formControl } from '@rolster/angular-forms';
import { maxValue, minValue, required } from '@rolster/validators/helpers';

const age = formControl(18, [required, minValue(18), maxValue(120)]);
const alias = formControl({ value: '', validators: [required] });
```

A custom validator is just a `ValidatorFn<T>`: it receives the value and returns a `ValidatorError` (invalid) or `undefined` (valid).

```typescript
import { formControl } from '@rolster/angular-forms';
import { ValidatorFn } from '@rolster/validators';

const isEven: ValidatorFn<number> = (value) =>
  value && value % 2 !== 0
    ? { id: 'even', message: 'Value must be even' }
    : undefined;

const amount = formControl(3, [isEven]);

amount.hasError('even'); // true
```

Group validators are `ValidatorGroupFn<C>` from `@rolster/forms`: they receive the `controls` and let you validate one field against another. Array validators (`ValidatorArrayFn`) follow the same idea, receiving the `groups` of the `FormArray`.

```typescript
import { ValidatorGroupFn } from '@rolster/forms';
import { FormControl, formControl, formGroup } from '@rolster/angular-forms';

type PasswordControls = {
  password: FormControl<string>;
  confirmation: FormControl<string>;
};

const passwordsMatch: ValidatorGroupFn<PasswordControls> = ({
  password,
  confirmation
}) =>
  password.value === confirmation.value
    ? undefined
    : { id: 'passwords', message: 'Passwords do not match' };

const formPassword = formGroup(
  { password: formControl(''), confirmation: formControl('') },
  [passwordsMatch]
);
```

### Types

The types mirror the ones of `@rolster/react-forms` with the `Angular` prefix. The generic order is `<T, E>`: the value type first and the element type second, defaulting to `HTMLElement`.

| Type                                             | Description                                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `AngularFormControl<T, E>`                       | Contract of a control: the `@rolster/forms` members, `signal`, `signals`.                                                   |
| `AngularFormVoid<T, E>`                          | The same with `T \| undefined` as value.                                                                                    |
| `AngularHtmlControl<T>` / `AngularHtmlVoid<T>`   | A control attached to an `HTMLElement`.                                                                                     |
| `AngularInputControl<T>` / `AngularInputVoid<T>` | A control attached to an `HTMLInputElement`.                                                                                |
| `AngularAreaControl` / `AngularAreaVoid`         | A control attached to an `HTMLTextAreaElement`.                                                                             |
| `AngularControl<T, E>` / `AngularVoid<T, E>`     | Union of a form control and an array control.                                                                               |
| `ControlSignals<T>`                              | The `signals` of a control.                                                                                                 |
| `ValueSetter<T>`                                 | The updater `(current) => next` accepted by `setValue`.                                                                     |
| `AngularControls<T>`                             | Record of controls: the shape accepted by `formGroup`.                                                                      |
| `AngularGroup<C>`                                | Contract of a group; `GroupSignals<C>` are its `signals`.                                                                   |
| `AngularFormList<T, E>` / `AngularHtmlList<T>`   | Contract of a `FormList`.                                                                                                   |
| `AngularArrayControl<T, E>`                      | A control with `uuid`; `AngularHtmlArrayControl`, `AngularInputArrayControl` and `AngularAreaArrayControl` fix the element. |
| `AngularArrayControls<T>`                        | Record of array controls: the controls shape of an array item.                                                              |
| `AngularArrayGroup<C, R>`                        | Contract of an item of a `FormArray`, with `uuid`, `resource` and `setResource`.                                            |
| `AngularArrayGroupOptions<C, R>`                 | `{ controls, validators?, resource?, uuid? }` of an array item.                                                             |
| `AngularFormArray<C, R, G>`                      | Contract of a `FormArray`; `ArraySignals<C, R, G>` are its `signals`.                                                       |
| `AngularArrayList<C, E>`                         | Contract of a `FormArrayList`; `ArrayListSignals<C>` are its `signals`.                                                     |
| `AngularListOptions<C>`                          | The options object accepted by `formArrayList`.                                                                             |
| `ArrayListValueToUuid<C>`                        | The `(value) => uuid` function of a `formArrayList`.                                                                        |

`ControlsValue<C>`, `ArrayControlsValue<C>`, `ValidatorGroupFn<C>`, `ValidatorArrayFn<C, R>`, `FormGroupOptions<C>` and `FormArrayOptions<C, R, G>` are the ones of `@rolster/forms`, shared with the React binding.

The classes themselves are exported too — `FormControl` / `FormVoid`, `FormGroup`, `FormList`, `FormArray`, `FormArrayGroup`, `FormArrayControl` / `FormArrayVoid`, `FormArrayList` and `FormArrayGroupSelect` — and are usually the ones you name in a component field or a helper signature.

## Contributing

:sparkles: Daniel Andrés Castillo Pedroza

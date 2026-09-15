# Rolster Angular Forms

It implements a set of classes that allow managing the control of states of the input components in Angular.

## Installation

```
npm i @rolster/angular-forms
```

Requires **Angular 20 or higher** (`^20 || ^21 || ^22`) and **Node 22 or higher**.

## Configuration

You must install the `@rolster/types` to define package data types, which are configured by adding them to the `files` property of the `tsconfig.json` file.

```json
{
  "files": ["node_modules/@rolster/types/index.d.ts"]
}
```

## Features

The Angular adaptation of [`@rolster/forms`](https://www.npmjs.com/package/@rolster/forms), rewritten on top of **signals**. It keeps the same vocabulary — **controls**, **groups** and **arrays** — and the same validators from [`@rolster/validators`](https://www.npmjs.com/package/@rolster/validators), but every state member (`signal`, `errors`, `valid`, `dirty`, `touched`, `disabled`, …) is a `Signal`, so templates, `computed` and `effect` react to a change automatically and there is no `subscribe` to manage.

There is nothing to import into a module: no `NgModule`, no directives, no providers. The building blocks are plain classes you instantiate as a field of the component, which also means they work with `ChangeDetectionStrategy.OnPush` and zoneless applications without any extra setup.

Each building block has a class and a matching factory function (the factory is the recommended way to create them):

| Class              | Factory              | Purpose                                         |
| ------------------ | -------------------- | ----------------------------------------------- |
| `FormControl`      | `formControl()`      | A single field                                  |
| `FormGroup`        | `formGroup()`        | A set of named controls (a form)                |
| `FormArray`        | `formArray()`        | A dynamic list of group items                   |
| `FormArrayGroup`   | `formArrayGroup()`   | A group item inside a `FormArray`               |
| `FormArrayControl` | `formArrayControl()` | A control (with `uuid`) inside a group item     |
| `FormArrayList`    | `formArrayList()`    | A control whose value is a list of control sets |

### FormControl

A control holds a value, its validators and a rich set of state signals. Both the constructor and the factory accept an options object (`{ value, validators? }`), the positional `(value, validators?)` pair, or nothing at all — in which case the value type is `T | undefined` (the `FormVoid<T>` alias).

| Member                  | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `signal`                | `Signal<T>` with the current value                                 |
| `value`                 | `T`: the current value, outside a reactive context                 |
| `errors` / `error`      | `ValidatorError[]` of the failed validators / the first one        |
| `valid` / `invalid`     | Whether every validator passes                                     |
| `dirty` / `pristine`    | Whether the value was changed through `setValue`                   |
| `touched` / `untouched` | Whether the field was interacted with (`touch()` / `blur()`)       |
| `focused` / `unfocused` | Whether the field is focused (`focus()` / `blur()`)                |
| `disabled` / `enabled`  | Whether the control is disabled                                    |
| `wrong`                 | `touched() && invalid()`, ideal for showing an error in a template |

`value` is the only member that is not a signal: it is a shortcut for `signal()`, so `control.value` and `control.signal()` always return the same thing. Read it from an event handler or a service; read the signal from a template, a `computed` or an `effect`.

**Methods:** `setValue(value)` (marks the control dirty), `setStartValue(value)` (updates the value without marking it dirty), `setDefaultValue(value)` (also replaces the value restored by `reset()`), `setValidators(validators)`, `reset()`, `disable()` / `enable()`, `focus()` / `blur()`, `touch()`, `hasError(id)`, `someErrors(ids)`.

```typescript
import { computed } from '@angular/core';
import { formControl } from '@rolster/angular-forms';
import { email, required } from '@rolster/validators/helpers';

const emailControl = formControl('', [required, email]);

emailControl.signal(); // ''
emailControl.valid(); // false
emailControl.error(); // { id: 'required', message: 'Field is required' }

emailControl.setValue('daniel@rolster.com');
emailControl.valid(); // true

// Every state member is a signal, so it composes with the rest of Angular
const message = computed(() =>
  emailControl.wrong() ? emailControl.error()?.message : undefined
);
```

### FormGroup

A group binds several named controls together and derives its aggregate state from them with `computed`. It accepts an `AngularFormGroupOptions<C>` (`{ controls, validators? }`) or the `(controls, validators?)` pair.

| Member                     | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `controls`                 | The controls record (a plain object, not a signal)            |
| `signal` / `value`         | `Signal` with the `{ key: value }` object / its current value |
| `errors` / `error`         | Errors of the group validators                                |
| `valid` / `invalid`        | Group validators pass **and** every control is valid          |
| `dirty` / `dirties`        | Any control / every control is dirty                          |
| `pristine` / `pristines`   | Negation of the two above                                     |
| `touched` / `toucheds`     | Any control / every control was touched                       |
| `untouched` / `untoucheds` | Negation of the two above                                     |
| `wrong`                    | `touched() && invalid()`                                      |

**Methods:** `setValue(partial)` (shallow merge, forwarded to each control), `setValidators(validators)` and `reset()`. Disabled controls are ignored when the aggregate flags are calculated.

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
    [value]="controls.email.signal()"
    (blur)="controls.email.blur()"
    (focus)="controls.email.focus()"
    (input)="controls.email.setValue($any($event.target).value)"
  />
  @if (controls.email.wrong()) {
  <span>{{ controls.email.error()?.message }}</span>
  }

  <input
    type="password"
    [value]="controls.password.signal()"
    (blur)="controls.password.blur()"
    (input)="controls.password.setValue($any($event.target).value)"
  />

  <button type="submit" [disabled]="formLogin.invalid()">Login</button>
  <button type="button" (click)="formLogin.reset()">Clear</button>
</form>
```

### FormArray

A `FormArray` manages a dynamic list of group items, perfect for repeatable sections such as "add another phone". Each item is a `FormArrayGroup` with a stable `uuid`, and its controls must be created with `formArrayControl` (a `FormControl` that also carries a `uuid`).

Besides the aggregate signals of a group — `dirty`/`dirties`, `pristine`/`pristines`, `touched`/`toucheds`, `untouched`/`untoucheds`, `valid`/`invalid`, `errors`/`error`, `wrong`, `disabled`/`enabled` — it exposes `groups` (`Signal<G[]>`), `controls` (`Signal<C[]>`), `signal` and `value`, plus the methods `push(group)`, `merge(groups)`, `remove(group)`, `findByUuid(uuid)`, `setValue(groups)`, `setStartValue(groups)`, `setDefaultValue(groups)`, `setValidators(validators)`, `disable()` / `enable()`, `hasError(id)`, `someErrors(ids)` and `reset()`.

```typescript
import { Component } from '@angular/core';
import {
  AbstractAngularArrayGroup,
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

  public onRemove(group: AbstractAngularArrayGroup<PhoneControls>): void {
    this.formPhones.remove(group);
  }
}
```

```html
@for (group of formPhones.groups(); track group.uuid) {
<div>
  <input
    [value]="group.controls.number.signal()"
    (blur)="group.controls.number.blur()"
    (input)="group.controls.number.setValue($any($event.target).value)"
  />
  <button type="button" (click)="onRemove(group)">Remove</button>
</div>
}

<button type="button" (click)="onAdd()">Add phone</button>
<span>{{ formPhones.groups().length }} phones</span>
```

A `FormArrayGroup` can also carry a typed `resource`: the original payload the item was built from, handy when mapping the group back to your domain model.

```typescript
const item = formArrayGroup({
  controls: { number: formArrayControl('3001234567') },
  resource: { id: 7 }
});

item.resource; // { id: 7 }
item.uuid; // stable identity, ideal for the @for track
```

### FormArrayList

A `FormArrayList<C>` is a control whose value is a list of plain objects, each one backed by a set of `FormArrayControl`s built with the `valueToControls` function you provide. Unlike the rest, its factory only accepts positional arguments: `formArrayList(valueToControls, value?, validators?)`.

```typescript
import {
  FormArrayControl,
  formArrayControl,
  formArrayList
} from '@rolster/angular-forms';

type TagControls = {
  name: FormArrayControl<string>;
};

const tags = formArrayList<TagControls>(
  ({ name }) => ({ name: formArrayControl(name) }),
  [{ name: 'forms' }]
);

tags.signal(); // [{ name: 'forms' }]
tags.push({ name: formArrayControl('signals') });
tags.controls().length; // 2
tags.remove(tags.controls()[0]);
```

`controls` is a `Signal<C[]>`, and `touched`, `dirty`, `signal` and `errors` are derived from the controls of every item, so the list state stays in sync without any extra wiring.

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

Group validators are `ValidatorGroupFn<C>`: they receive the `controls` and let you validate one field against another. Array validators follow the same idea, receiving the `groups` of the `FormArray`.

```typescript
import {
  FormControl,
  formControl,
  formGroup,
  ValidatorGroupFn
} from '@rolster/angular-forms';

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

| Type                                   | Description                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| `AbstractAngularControl<T>`            | Base contract of a control: `signal`, `value` and the state signals.  |
| `AngularFormControl<T>`                | Contract of a control: signals, `setValue`, `focus`/`blur`.           |
| `AngularControl<T>` / `AngularVoid<T>` | Alias of the contract / the same with `T \| undefined` as value.      |
| `AngularFormControls<T>`               | Record of controls: the shape accepted by `formGroup`.                |
| `AngularFormGroupOptions<C>`           | `{ controls, validators? }` accepted by `formGroup`.                  |
| `AbstractAngularFormGroup<C>`          | Contract of a group: `controls`, aggregated signals, `setValue`.      |
| `AngularControlsValue<C>`              | The `{ key: value }` object exposed by `group.value`.                 |
| `AngularControlsSignal<C>`             | The `{ key: Signal }` object built from each control's `signal`.      |
| `ValidatorGroupFn<C>`                  | A group validator: receives the `controls`.                           |
| `AngularArrayControl<T>`               | Contract of a control with `uuid`; implemented by `FormArrayControl`. |
| `AngularArrayControls<T>`              | Record of array controls: the controls shape of an array item.        |
| `AngularArrayControlsData<C>`          | The `{ key: value }` object of a single array item.                   |
| `AbstractAngularArray<C, R>`           | Contract of a `FormArray`: `groups`, `controls`, `push`/`remove`.     |
| `AbstractAngularArrayGroup<C, R>`      | Contract of an item of a `FormArray`, with `uuid` and `resource`.     |
| `AngularFormArrayGroupOptions<C, R>`   | `{ controls, validators?, resource?, uuid }` of an array item.        |
| `AngularArrayList<C>`                  | Contract of a `FormArrayList`: `controls`, `push`, `remove`.          |
| `AngularArrayListValueToControls<C>`   | The `(value) => controls` function a `formArrayList` is built with.   |

The classes themselves are exported too — `FormControl` / `FormVoid`, `FormGroup`, `FormArray`, `FormArrayGroup`, `FormArrayControl` / `FormArrayVoid`, `FormArrayControls` and `FormArrayList` — and are usually the ones you name in a component field or a helper signature. The `*Void` aliases are the same type with `T | undefined` as value, which is what a control created without an initial value returns.

## Contributing

- Daniel Andrés Castillo Pedroza :rocket:

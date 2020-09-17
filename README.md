# react-final-form-graceful-field

[![CircleCI](https://circleci.com/gh/jcoreio/react-final-form-graceful-field.svg?style=svg)](https://circleci.com/gh/jcoreio/react-final-form-graceful-field)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-final-form-graceful-field/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/react-final-form-graceful-field)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-final-form-graceful-field.svg)](https://badge.fury.io/js/react-final-form-graceful-field)

parse and format that work how you actually want them to for `react-final-form`

# Why you would want to use this

If you've wanted to take number typed in and store the value as an actual `number` instead of text, without destroying UX, this is for you.
That's what I wrote this for, although it supports any use case where you want to stash the raw value in field metadata.

The official advice from Erik Rasmussen is to store the raw string that was typed in and parse it in the submit handler, but that sucks:

- Reparsing nested numeric fields within complex forms is a hassle
- If you have validators that compare two numeric fields, for example a min <= max constraint, you have to reparse the numbers there too.

`react-final-form-graceful-field` allows you to use `parse` and `format` but it displays the raw value instead of formatted while
the field is active or `parse` threw an error. That's right, `parse` can throw an error, and doing so will trigger a validation error on the field as well.

This way you can successfully type in `5.23`, whereas a naive `parse={parseFloat}` approach will kill the `.` before you can type anything
after it.

# Important

**Important**: `react-final-form-graceful-field` requires you to use the [`setFieldData` mutator](https://github.com/final-form/final-form-set-field-data) on your form:

```js
import setFieldData from 'final-form-set-field-data'
const mutators = { setFieldData }

const MyForm = () => (
  <Form mutators={mutators} onSubmit={console.log}>
    ...
  </Form>
)
```

# Example

```js
// @flow

import * as React from 'react'
import { render } from 'react-dom'
import { Form } from 'react-final-form'
import { GracefulField } from '../src'
import setFieldData from 'final-form-set-field-data'

const format = (value: ?number): string =>
  Number.isFinite(value) ? String(value) : ''

const parse = (value: ?string): ?number => {
  value = value ? value.trim() : null
  if (!value) return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) throw new Error(`invalid number`)
  return parsed
}

const mutators = { setFieldData }

render(
  <Form onSubmit={console.log} mutators={mutators}>
    {({ values, form, ...rest }) => (
      <div>
        <GracefulField
          name="price"
          format={format}
          parse={parse}
          component="input"
          invalidValue={NaN}
        />
        <button type="button" onClick={() => form.change('price', 5)}>
          Set to 5
        </button>
        <pre>{JSON.stringify({ values, rest }, null, 2)}</pre>
      </div>
    )}
  </Form>,
  (document.getElementById('root'): any)
)
```

# API

## `GracefulField`

```js
import { GracefulField } from 'react-final-form-graceful-field'
```

Has the same API as `<Field>` except:

- `parse` may throw an error, which will trigger a validation error.
- Accepts an `invalidValue` property, which will be used if `parse` throws an error.
- No `formatOnBlur` property. It formats on blur by default if `parse` didn't throw an error and you provide `format`.

## `useGracefulField`

```js
import { useGracefulField } from 'react-final-form-graceful-field'
```

Has the same API as `useField` except:

- `parse` may throw an error, which will trigger a validation error.
- Accepts an `invalidValue` property, which will be used if `parse` throws an error.
- No `formatOnBlur` property. It formats on blur by default if `parse` didn't throw an error and you provide `format`.

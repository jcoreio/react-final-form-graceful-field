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
  if (!Number.isFinite(parsed)) throw new Error(`invalid number: ${value}`)
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

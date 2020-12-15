// @flow

import {
  type FieldValidator,
  type FieldSubscription,
  type FieldState,
} from 'final-form'
import { useForm, type FieldRenderProps, useField } from 'react-final-form'
import * as React from 'react'

export type UseGracefulFieldProps = {
  afterSubmit?: () => void,
  allowNull?: boolean,
  beforeSubmit?: () => void | false,
  component?: React.ComponentType<any> | 'input' | 'select' | 'textarea',
  children?: ((props: any) => React.Node) | React.Node,
  render?: (props: any) => React.Node,
  data?: Object,
  defaultValue?: any,
  format?: (value: any, name: string) => any,
  initialValue?: any,
  invalidValue?: any,
  isEqual?: (a: any, b: any) => boolean,
  multiple?: boolean,
  parse?: (value: any, name: string) => any,
  type?: string,
  validate?: FieldValidator,
  validateFields?: string[],
  value?: any,
  subscription?: FieldSubscription,
}

type RawInfo = {
  rawValue: any,
  parsedValue: any,
  parseError: ?Error,
}

function getRaw(meta: ?$PropertyType<FieldRenderProps, 'meta'>): ?RawInfo {
  return meta?.data?.['react-final-form-graceful-field']
}

export default function useGracefulField(
  name: string,
  {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    data,
    defaultValue,
    format,
    initialValue,
    invalidValue,
    isEqual,
    multiple,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
  }: UseGracefulFieldProps
): FieldRenderProps {
  const form = useForm('useField')

  const [lastFormValue, setLastFormValue] = React.useState()

  const field: FieldRenderProps = useField(name, {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    data,
    defaultValue,
    format: (value: any, name: string): any => {
      if (value !== lastFormValue) {
        setTimeout(() => setLastFormValue(value), 0)
      }
      return raw && (field.meta.active || raw.parseError)
        ? raw.rawValue
        : format
        ? format(value, name)
        : value
    },
    formatOnBlur: false,
    initialValue,
    isEqual,
    multiple,
    parse: (value: any, name: string): any => {
      let parseError
      let parsedValue
      try {
        return (parsedValue = parse ? parse(value, name) : value)
      } catch (error) {
        parseError = error
        return (parsedValue = invalidValue)
      } finally {
        form.mutators.setFieldData(name, {
          'react-final-form-graceful-field': {
            rawValue: value,
            parsedValue,
            parseError,
          },
        })
      }
    },
    subscription,
    type,
    validate: (value: any, allValues: any, meta: ?FieldState): any => {
      const raw = getRaw(meta)
      if (raw && raw.parseError && Object.is(raw.parsedValue, value)) {
        return raw.parseError.message
      }
      if (validate) return validate(value, allValues, meta)
    },
    validateFields,
    value,
  })

  const raw = getRaw(field.meta)

  React.useEffect(
    () => {
      if (field.meta.active) return
      if (raw && !raw.parseError) {
        form.mutators.setFieldData(name, {
          'react-final-form-graceful-field': null,
        })
      }
    },
    [field.meta.active]
  )

  React.useEffect(
    () => {
      if (field.meta.active) return
      form.mutators.setFieldData(name, {
        'react-final-form-graceful-field': null,
      })
    },
    [lastFormValue]
  )

  return field
}

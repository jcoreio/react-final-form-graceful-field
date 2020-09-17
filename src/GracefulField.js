// @flow

import * as React from 'react'
import useGracefulField from './useGracefulField'
import { type FieldRenderProps } from 'react-final-form'
import { type FieldValidator, type FieldSubscription } from 'final-form'

export type GracefulFieldProps = {
  name: string,
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

const GracefulField = React.forwardRef<any, GracefulFieldProps>(
  function GracefulField(
    {
      afterSubmit,
      allowNull,
      beforeSubmit,
      children,
      component,
      render,
      data,
      defaultValue,
      format,
      initialValue,
      invalidValue,
      isEqual,
      multiple,
      name,
      parse,
      subscription,
      type,
      validate,
      validateFields,
      value,
      ...rest
    }: GracefulFieldProps,
    ref: any
  ): React.Node {
    if (!name) {
      throw new Error(
        'prop name cannot be undefined in <GracefulField> component'
      )
    }

    const field: FieldRenderProps = useGracefulField(name, {
      afterSubmit,
      allowNull,
      beforeSubmit,
      children,
      component,
      data,
      defaultValue,
      format,
      initialValue,
      isEqual,
      multiple,
      parse,
      subscription,
      type,
      validate,
      validateFields,
      value,
    })

    if (typeof children === 'function') {
      return (children: Function)({ ...field, ...rest })
    }

    if (typeof component === 'string') {
      // ignore meta, combine input with any other props
      // eslint-disable-next-line react/no-children-prop
      return React.createElement((component: any), {
        ...field.input,
        children,
        ref,
        ...rest,
      })
    }

    if (component) {
      return React.createElement(component, { ref, ...rest, ...field })
    }
    if (typeof render !== 'function') {
      throw new Error(
        `Must specify either a render prop, a render function as children, or a component prop to GracefulField(${name})`
      )
    }
    return render(
      children === undefined
        ? { ref, ...rest, ...field }
        : { ref, ...rest, ...field, children }
    )
  }
)

export default GracefulField

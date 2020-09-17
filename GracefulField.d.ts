// @flow

import * as React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FieldValidator, FieldSubscription } from 'final-form'

export type GracefulFieldProps = {
  name: string
  afterSubmit?: () => void
  allowNull?: boolean
  beforeSubmit?: () => void | false
  component?: React.ComponentType<any> | 'input' | 'select' | 'textarea'
  children?: ((props: any) => React.ReactNode) | React.ReactNode
  render?: (props: any) => React.ReactNode
  data?: Object
  defaultValue?: any
  format?: (value: any, name: string) => any
  initialValue?: any
  invalidValue?: any
  isEqual?: (a: any, b: any) => boolean
  multiple?: boolean
  parse?: (value: any, name: string) => any
  type?: string
  validate?: FieldValidator
  validateFields?: string[]
  value?: any
  subscription?: FieldSubscription
}

export default function GracefulField(
  props: GracefulFieldProps
): React.ReactNode

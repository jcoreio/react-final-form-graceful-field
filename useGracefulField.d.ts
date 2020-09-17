import { FieldValidator, FieldSubscription, FieldState } from 'final-form'
import { FieldRenderProps } from 'react-final-form'
import * as React from 'react'

export type UseGracefulFieldProps = {
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

export default function useGracefulField(
  name: string,
  props: UseGracefulFieldProps
): FieldRenderProps

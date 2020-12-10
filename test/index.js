import { describe, it } from 'mocha'
import { expect } from 'chai'

import * as React from 'react'
import { mount } from 'enzyme'
import { Form } from 'react-final-form'
import setFieldData from 'final-form-set-field-data'
import { ErrorBoundary } from 'react-error-boundary'
import { GracefulField } from '../src'
import delay from 'waait'
const mutators = { setFieldData }

const format = value => (Number.isFinite(value) ? String(value) : '')

const parse = value => {
  value = value ? value.trim() : null
  if (!value) return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) throw new Error(`invalid number: ${value}`)
  return parsed
}

describe(`GracefulField`, function() {
  it(`sets values when valid`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })
  it(`formats on blur if valid`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('23.5')
  })
  it(`on blur without format`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return <GracefulField name="test" component="input" parse={parse} />
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal(23.5)
  })
  it(`on blur without format -- nested name`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField name="test.foo" component="input" parse={parse} />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.values.test?.foo).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal(23.5)
  })
  it(`leaves raw value on blur if invalid`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5b ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  23.5b ')
  })
  it(`leaves raw value on blur if invalid - nested name`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test.foo"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5b ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.values.test?.foo).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  23.5b ')
  })

  it(`causes validation error when field becomes invalid`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.not.exist
    expect(props.values.test).to.equal(23.5)

    comp.find('input').simulate('change', { target: { value: '  23.5b ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('invalid number: 23.5b')
    expect(props.values.test).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  23.5b ')

    comp.find('input').simulate('change', { target: { value: '  23.5bc ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('invalid number: 23.5bc')
    expect(props.values.test).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  23.5bc ')
  })

  it(`clears validation error when field becomes valid again`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5b ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('invalid number: 23.5b')
    expect(props.values.test).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  23.5b ')

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.not.exist
    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })

  it(`calls validate function if valid`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
              validate={value => (value < 0 ? 'must be >= 0' : undefined)}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  -23.5b ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('invalid number: -23.5b')
    expect(props.values.test).to.equal(undefined)
    expect(comp.find('input').prop('value')).to.equal('  -23.5b ')

    comp.find('input').simulate('change', { target: { value: '  -23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('must be >= 0')
    expect(props.values.test).to.equal(-23.5)
    expect(comp.find('input').prop('value')).to.equal('  -23.5 ')

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.not.exist
    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })

  it(`when value is changed while field is invalid+inactive`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5b ' } })
    await delay(0)
    comp.update()

    expect(props.form.getState().errors.test).to.equal('invalid number: 23.5b')

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    props.form.change('test', 5)
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(5)
    expect(comp.find('input').prop('value')).to.equal('5')
    expect(props.form.getState().errors.test).to.not.exist
  })
  it(`when value is changed while field is valid+inactive`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component="input"
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    comp.find('input').simulate('blur')
    await delay(0)
    comp.update()

    props.form.change('test', 5)
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(5)
    expect(comp.find('input').prop('value')).to.equal('5')
  })
  it(`custom component coverage`, async function() {
    const Input = ({ input }) => <input {...input} />

    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              component={Input}
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })
  it(`render prop coverage`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField
              name="test"
              render={({ input }) => <input {...input} />}
              format={format}
              parse={parse}
            />
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })
  it(`child function coverage`, async function() {
    let props
    const comp = mount(
      <Form mutators={mutators} onSubmit={() => {}}>
        {p => {
          props = p
          return (
            <GracefulField name="test" format={format} parse={parse}>
              {({ input }) => <input {...input} />}
            </GracefulField>
          )
        }}
      </Form>
    )
    await delay(0)
    comp.update()

    comp.find('input').simulate('focus')
    await delay(0)
    comp.update()

    comp.find('input').simulate('change', { target: { value: '  23.5 ' } })
    await delay(0)
    comp.update()

    expect(props.values.test).to.equal(23.5)
    expect(comp.find('input').prop('value')).to.equal('  23.5 ')
  })
  it(`missing name error`, async function() {
    let error
    mount(
      <ErrorBoundary
        FallbackComponent="div"
        onError={e => {
          error = e
        }}
      >
        <Form mutators={mutators} onSubmit={() => {}}>
          {() => (
            <GracefulField format={format} parse={parse} component="input" />
          )}
        </Form>
      </ErrorBoundary>
    )
    expect(error.message).to.equal(
      'prop name cannot be undefined in <GracefulField> component'
    )
  })
  it(`missing children, component, and render error`, async function() {
    let error
    mount(
      <ErrorBoundary
        FallbackComponent="div"
        onError={e => {
          error = e
        }}
      >
        <Form mutators={mutators} onSubmit={() => {}}>
          {() => <GracefulField name="test" format={format} parse={parse} />}
        </Form>
      </ErrorBoundary>
    )
    expect(error.message).to.equal(
      `Must specify either a render prop, a render function as children, or a component prop to GracefulField(test)`
    )
  })
})

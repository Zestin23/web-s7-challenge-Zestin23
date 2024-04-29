import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from "yup"

// 👇 Here are the validation errors you will use with Yup.

// TO DO! 
// 1. SUCCESSFUL ORDER CLEARS FORM
// 2. VALIDATION OF "FULLNAME" RENDERS CORRECT ERROR MESSAGE 
// 3. VALIDATION OF "SIZE" REMDERS CORRECT ERROR MESSAGE
// 4. TESTS

const e = {
  fullNameType: 'fullName must be a string',
  fullNameRequired: 'fullName is required',
  fullNameMin: 'fullName must be at least 3 characters',
  fullNameMax: 'fullName cannot exceed 20 characters',
  sizeRequired: 'size is required',
  sizeOptions: 'size must be one of the following values: S, M, L',
  toppingsRequired: 'toppings is required',
  toppingsType: 'toppings must be an array of IDs',
  toppingInvalid: 'topping ID invalid',
  toppingRepeated: 'topping IDs cannot be repeated',
}

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

const getInitialValues = () => ({
  fullName: "",
  size: "",
  toppings: []
})

const getInitialErrors = () => ({
  fullName: "",
  size: "",
  toppings: ""
})

// 👇 Here you will create your schema.

const pizzaSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .typeError(e.fullNameType)
    .required(e.fullNameRequired)
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup
    .string()
    .trim()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
    .required(e.sizeRequired),
  toppings: yup
    .array()
    .typeError(e.toppingsType)
    .of(
      yup.number().typeError(e.toppingsType)
        .integer(e.toppingsType)
        .min(1, e.toppingInvalid)
        .max(5, e.toppingInvalid)
    )
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.   <--------- ????
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const sizes = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
}

export default function Form() {
  const [values, setValues] = useState(getInitialValues())
  const [errors, setErrors] = useState(getInitialErrors())
  const [serverSuccess, setServerSuccess] = useState()
  const [serverFailure, setServerFailure] = useState()
  const [formEnabled, setFormEnabled] = useState(false)

  useEffect(() => {
    pizzaSchema.isValid(values).then(isValid => setFormEnabled(isValid))
  }, [values])

  const onChange = evt => {
    let { type, name, value, checked, id } = evt.target
    value = type == "checkbox" ? checked : value
    if (type === "checkbox") {
      if (value === false && values.toppings.includes(id)) {
        setValues(prev => ({ ...prev, toppings: prev.toppings.filter(num => num != id) }))
      } else {
        setValues(prev => ({ ...prev, toppings: [...prev.toppings, id] }))
      }
    } else {
      setValues({ ...values, [name]: value })
    }
    yup.reach(pizzaSchema, name).validate(value)
      .then(() => setErrors({ ...errors, [name]: "" }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }))
  }

  // console.log(errors)

  const onSubmit = (evt) => {
    evt.preventDefault()


    if (!formEnabled) return


    axios.post('http://localhost:9009/api/order', values)
      .then(res => {
        setValues(getInitialValues())            // <------------------- NOT RESETTING NAME
        setServerSuccess(res.data.message)
        setServerFailure()
      })
      .catch(err => {
        setServerFailure(err.response.data.message)
        setServerSuccess()
      })
      .catch(() => setValues(getInitialValues))
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='error'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name
            <input
              name="fullName"
              type="text"
              id="fullName"
              placeholder="Type full name"
              onChange={onChange}
              value={values.fullName}
            />
          </label><br />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size
            <select
              id="size"
              name='size'
              onChange={onChange}
              value={values.size}
            >
              {/* {Object.entries(sizes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))} */}

              <option value="">----Choose Size----</option>

              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>

            </select>
          </label><br />
          {errors.size && <div className='error'>{errors.size}</div>}
        </div>

      </div>

      <div className="input-group">

        <label>
          <input
            name="toppings"
            type="checkbox"
            onChange={onChange}
            checked={values.toppings.includes(toppings[0].topping_id)}
            id={toppings[0].topping_id}
          />Pepperoni<br />
        </label>

        <label>
          <input
            name="toppings"
            type="checkbox"
            onChange={onChange}
            checked={values.toppings.includes(toppings[1].topping_id)}
            id={toppings[1].topping_id}
          />Green Peppers<br />
        </label>

        <label>
          <input
            name="toppings"
            type="checkbox"
            onChange={onChange}
            checked={values.toppings.includes(toppings[2].topping_id)}
            id={toppings[2].topping_id}
          />Pineapple<br />
        </label>

        <label>
          <input
            name="toppings"
            type="checkbox"
            onChange={onChange}
            checked={values.toppings.includes(toppings[3].topping_id)}
            id={toppings[3].topping_id}
          />Mushrooms<br />
        </label>

        <label>
          <input
            name="toppings"
            type="checkbox"
            onChange={onChange}
            checked={values.toppings.includes(toppings[4].topping_id)}
            id={toppings[4].topping_id}
          />Ham<br />
        </label>
        {errors.toppings && <div className='error'>{errors.toppings}</div>}
      </div>

      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <div>
        <input disabled={!formEnabled} type="submit" />
      </div>
    </form>
  )
}

import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import React, { useState } from 'react';
import { FormInput } from './FormInput';
import { useNavigate } from 'react-router-dom';

//import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }

    if (err) return

    setLoading(true)

    try {
    //   const res = await authApi.login({ username, password })
    //   setLoading(false)
    //   localStorage.setItem('token', res.token)
    //   navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
      })
      setLoading(false)
    }
  }
  return (
    <>
      <div className='signup-box'>
        <img
          src='ce5e4258e08e36c337f68f7d7c54764c.jpg'
          className='signup-img'
        />
        <Form
          className='k-mt-1'
          component='form'
          onSubmit={handleSubmit}
          render={(formRenderProps) => (
            <FormElement
              style={{
                width: 400,
                margin: 'auto',
              }}
            >
              <fieldset
                className={
                  'k-form-fieldset  k-d-inline-block k-ml-auto k-mr-auto'
                }
              >
                <Field
                  margin='normal'
                  required
                  fullWidth
                  id={'Username'}
                  name={'username'}
                  label={'Username'}
                  disabled={loading}
                  component={FormInput}
                />
                <Field
                  margin='normal'
                  required
                  fullWidth
                  type='password'
                  id={'password'}
                  name={'password'}
                  label={'Password'}
                  disabled={loading}
                  component={FormInput}
                />

                <Button
                  className='k-mt-3 k-mb-2'
                  themeColor={'primary'}
                  type={'submit'}
                >Login
                </Button>
              </fieldset>
            </FormElement>
          )}
        />
        <div className='k-d-flex k-flex-column'>
          <Button themeColor={'info'} fillMode='outline' icon='facebook'>
            Login with facebook
          </Button>
          <Button
            fillMode='flat'
            themeColor={'primary'}
            onClick={()=>navigate('/signup')}
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </div>
    </>
    
  )
}

export default Login
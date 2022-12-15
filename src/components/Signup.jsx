import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import React, { useState } from 'react';
import { FormInput } from './FormInput';

import { useNavigate } from 'react-router-dom';

// import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');
    setConfirmPasswordErrText('');

    const data = new FormData(e.target);
    const username = data.get('username').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();

    let err = false;

    if (username === '') {
      err = true;
      setUsernameErrText('Please fill this field');
    }
    if (password === '') {
      err = true;
      setPasswordErrText('Please fill this field');
    }
    if (confirmPassword === '') {
      err = true;
      setConfirmPasswordErrText('Please fill this field');
    }
    if (password !== confirmPassword) {
      err = true;
      setConfirmPasswordErrText('Confirm password not match');
    }

    if (err) return;

    setLoading(true);

    try {
      //   const res = await authApi.signup({
      //     username, password, confirmPassword
      //   })
      //   setLoading(false)
      //   localStorage.setItem('token', res.token)
      // navigate('/');
    } catch (err) {
      const errors = err.data.errors;
      errors.forEach((e) => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg);
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg);
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg);
        }
      });
      setLoading(false);
    }
  };

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
                <Field
                  margin='normal'
                  required
                  fullWidth
                  type='password'
                  id={'confirmPassword'}
                  name={'confirmPassword'}
                  label={'Confirm Password'}
                  disabled={loading}
                  component={FormInput}
                />

                <Button
                  className='k-mt-3 k-mb-2'
                  themeColor={'primary'}
                  type={'submit'}
                >
                  Sign up
                </Button>
              </fieldset>
            </FormElement>
          )}
        />
        <div className='k-d-flex k-flex-column'>
          <Button themeColor={'info'} fillMode='outline' icon='facebook'>
            Sign up with facebook
          </Button>
          <Button
            fillMode='flat'
            themeColor={'primary'}
            onClick={()=>navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Signup;

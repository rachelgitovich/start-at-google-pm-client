import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target);
    const email = data.get('email').trim();
    const password = data.get('password').trim();

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      email: email,
      password: password,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('http://localhost:8080/api/v1/auth/authenticate', requestOptions)
      .then((response) => {
        if (response.ok) {
          response.json().then((result) => {
            localStorage.setItem('token', result.data);
            setIsAuthenticated(true);
            navigate('/');
          });
        } else {
          response.json().then((result) => alert(result.message));
        }
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <>
      <div className='signup-box'>
        <img
          src='ce5e4258e08e36c337f68f7d7c54764c.jpg'
          className='signup-img'
        />
        <form className='k-form k-mt-1' onSubmit={handleSubmit}>
          <fieldset className='k-form-fieldset  k-d-inline-block k-ml-auto k-mr-auto'>
            <div className='mb-3'>
              <Input
                validityStyles={false}
                name='email'
                label='Email'
                type='email'
                minLength={2}
                required={true}
                margin='normal'
                id={'Email'}
                disabled={loading}
              />
            </div>
            <div className='mb-3'>
              <Input
                validityStyles={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern='^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$'
                name='password'
                type='password'
                label='Password'
                required={true}
                margin='normal'
                id={'password'}
                disabled={loading}
                minLength={8}
                maxLength={20}
              />
            </div>
            <Button
              className='k-mt-3 k-mb-2'
              themeColor={'primary'}
              type={'submit'}
            >
              Login
            </Button>
          </fieldset>
        </form>

        <div className='k-d-flex k-flex-column'>
          <a
            href='https://github.com/login/oauth/authorize?client_id=3832c4b642dd6c67333d&scope=user:email'
            className='k-button k-button-md k-button-solid k-button-solid-base k-rounded-md k-mt-3 k-mb-2 github-btn'
          >
            <i className='k-button-icon fa-brands fa-github fa-fw'></i>
            Login with GitHub
          </a>
          <Button
            fillMode='flat'
            themeColor={'primary'}
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign up
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;

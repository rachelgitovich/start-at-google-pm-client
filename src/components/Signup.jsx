import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpPopup from './SignUpPopup';

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const confirmPasswordValidationMessage = 'Passwords does not match!';
  const toggleDialog = () => {
    setShowPopup(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData(e.target);
    const email = data.get('email').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      email: email,
      password: password,
      matchingPassword: confirmPassword,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('http://localhost:8080/api/v1/user/registration', requestOptions)
      .then((response) => {
        if (response.status !== 201) response.json();
        else {
          // alert("user created successfully")
          // navigate('/login');
          setShowPopup(true);
          return;
        }
      })
      .then((result) => alert(result.message))
      .catch((error) => console.log('error', error))
      .finally(setLoading(false));
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
                fullWidth
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
                fullWidth
                id={'password'}
                disabled={loading}
                minLength={8}
                maxLength={20}
              />
            </div>
            <div className='mb-3'>
              <Input
                validityStyles={false}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name='confirmPassword'
                type='password'
                style={{
                  width: '100%',
                }}
                label='Confirm Password'
                valid={password === confirmPassword}
                minLength={8}
                maxLength={20}
                validationMessage={confirmPasswordValidationMessage}
                margin='normal'
                required
                fullWidth
                id={'confirmPassword'}
                disabled={loading}
              />
            </div>
          </fieldset>
          <Button
            className='k-mt-3 k-mb-2'
            themeColor={'primary'}
            type={'submit'}
          >
            Sign up
          </Button>
        </form>
        <div className='k-d-flex k-flex-column'>
          <Button
            className='k-mt-3 k-mb-2 google-btn'
            iconClass='fa-brands fa-github fa-fw'
          >
            Sign up with GitHub
          </Button>
          <Button
            fillMode='flat'
            themeColor={'primary'}
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
      {showPopup && <SignUpPopup/>}
    </>
  );
};

export default Signup;

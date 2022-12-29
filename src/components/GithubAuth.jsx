import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function GithubAuth({ setIsAuthenticated }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    let code = searchParams.get('code');
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `http://localhost:8080/api/v1/auth/github/?code=${code}`,
      requestOptions
    )
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
  }, []);

  return <></>;
}

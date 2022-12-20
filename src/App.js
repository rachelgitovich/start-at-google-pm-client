import '@progress/kendo-theme-default/dist/all.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Board from './components/Board';
import GithubAuth from './components/GithubAuth';
import Home from './components/Home';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './components/Login';
import Signup from './components/Signup';
import authUtils from './utils/authUtils';
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authUtils.isAuthenticated());
  });
 
  return (
    <BrowserRouter>
      <Routes>

        {isAuthenticated ? (
          <Route path='/' element={<AppLayout isAuthenticated={isAuthenticated}/>}>
            <Route index element={ <Home /> } />
            <Route path='home' element={<Home />} />
            <Route path='boards/:boardId' element={ <Board /> } />
          </Route>
        ) : (
          <Route path='/' element={<AuthLayout setIsAuthenticated={setIsAuthenticated}/>}>
            <Route index element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
            <Route path='login' element={<Login setIsAuthenticated={setIsAuthenticated}/>} />
              <Route path='signup' element={ <Signup /> } />
            <Route path='auth/github' element={ <GithubAuth setIsAuthenticated={setIsAuthenticated}/>} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

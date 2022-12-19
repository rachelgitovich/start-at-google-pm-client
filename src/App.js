import * as React from 'react';
import Signup from './components/Signup';
import Board from './components/Board';
import Login from './components/Login';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<AuthLayout />}>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        </Route>
        <Route path='/' element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='boards/:boardId' element={<Board />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

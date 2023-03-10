import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../SideBar';
import NavBar from '../NavBar';


export default function AppLayout({isAuthenticated}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  });

  return (
    <>
      <NavBar/>
      <div className="appLayout">
        <Sidebar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

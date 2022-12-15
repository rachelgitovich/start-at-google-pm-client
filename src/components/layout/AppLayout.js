import React from 'react'
import Sidebar from '../SideBar'
import { Outlet } from 'react-router-dom'


export default function AppLayout() {
  return (
    <div className='appLayout'>
        <Sidebar />
        <div className='app-content'>
          <Outlet />
        </div>
      </div>
  )
}

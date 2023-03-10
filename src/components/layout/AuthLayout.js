import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'

const AuthLayout = ({setIsAuthenticated}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
        setIsAuthenticated(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading />
    ) : (
        <div className='authLayout'>
          <Outlet />
        </div>
    )
  )
}

export default AuthLayout
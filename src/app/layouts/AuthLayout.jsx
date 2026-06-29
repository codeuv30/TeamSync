import React from 'react'
import { Outlet } from 'react-router'
import ChangeTheme from '../../components/ChangeTheme'

const AuthLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <ChangeTheme />
    </>
  )
}

export default AuthLayout
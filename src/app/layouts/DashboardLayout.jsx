import React from 'react'
import { Outlet } from 'react-router'
import ChangeTheme from '../../components/ChangeTheme'

const DashboardLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <ChangeTheme />
    </>
  )
}

export default DashboardLayout
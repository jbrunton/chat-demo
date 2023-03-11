import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './shared/navigation/organisms/Header'

export const Layout = () => (
  <>
    <Header />
    <div className='content'>
      <Outlet />
    </div>
  </>
)

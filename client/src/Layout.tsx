import React, { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './shared/navigation/organisms/Header'

export const Layout = ({ children }: PropsWithChildren) => (
  <>
    <Header />
    <div className='content'>{children ?? <Outlet />}</div>
  </>
)

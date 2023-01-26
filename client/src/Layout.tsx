import React from 'react'
import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const Layout = () => (
  <Box m='2'>
    <Header />
    <Outlet />
  </Box>
)

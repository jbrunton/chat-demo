import React from 'react'
import { Container, Alert, AlertIcon, AlertTitle, AlertDescription, Box, Center } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { HeaderTemplate } from './shared/navigation/molecules/HeaderTemplate'

export const ErrorPage = () => {
  const error = useRouteError()
  const { message } = getErrorDetails(error)
  return (
    <>
      <HeaderTemplate title='Chat Demo' />
      <Center height='100%'>
        <Container maxWidth='container.lg'>
          <Alert status='error' variant='top-accent' p='10'>
            <AlertIcon boxSize='40px' ml='20px' mr='40px' />
            <Box>
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                Uh oh!
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Center>
    </>
  )
}

type ErrorDetails = {
  message: string
}

const getErrorDetails = (error: unknown): ErrorDetails => {
  if (error instanceof AxiosError) {
    const serverMessage = error.response?.data.message
    if (serverMessage) {
      return {
        message: serverMessage,
      }
    }
  }

  if (isRouteErrorResponse(error) && error.status === 404) {
    return {
      message: 'Looks like this page is missing',
    }
  }

  return {
    message: 'There was an unknown error. Please try again later',
  }
}

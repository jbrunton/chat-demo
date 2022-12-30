import React from 'react'
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'

export const NotFoundPage = () => {
  return (
    <Alert
      background='none'
      status='error'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        Page Not Found
      </AlertTitle>
      <AlertDescription maxWidth='sm'>Looks like this URL doesn&apos;t work.</AlertDescription>
    </Alert>
  )
}

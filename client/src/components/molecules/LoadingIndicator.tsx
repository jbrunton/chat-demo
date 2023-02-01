import React, { useEffect, useRef, useState } from 'react'
import { Box, Center, Flex, Spinner } from '@chakra-ui/react'

export const LoadingIndicator = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setOffset(-ref.current.clientHeight / 2)
    }
  }, [ref])

  return (
    <Flex>
      <Box position={'fixed'} top='50%' left='50%' marginLeft={offset}>
        <Center>
          <Spinner ref={ref} size={'xl'} />
        </Center>
      </Box>
    </Flex>
  )
}

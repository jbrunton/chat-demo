import { Flex, Heading, Spacer, HStack, IconButton, Icon } from '@chakra-ui/react'
import React, { FC } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'

type HeaderTemplateProps = {
  title: string
  onOpen?: () => void
}

export const HeaderTemplate: FC<HeaderTemplateProps> = ({ title, onOpen }) => (
  <Flex className='header' p='6px' align='center'>
    <Heading size={{ base: 'sm', lg: 'md' }} noOfLines={1}>
      {title}
    </Heading>
    <Spacer />
    {onOpen ? (
      <HStack align='center'>
        <IconButton variant='ghost' icon={<DrawerIcon />} aria-label={'Open Menu'} onClick={onOpen} />
      </HStack>
    ) : null}
  </Flex>
)

const DrawerIcon = () => <Icon as={AiOutlineMenu} boxSize={5} />

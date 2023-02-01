import React from 'react'
import { Avatar, AvatarProps } from '@chakra-ui/react'

type UserAvatarProps = Pick<AvatarProps, 'icon' | 'backgroundColor' | 'referrerPolicy' | 'src'>

export const UserAvatar = (params: UserAvatarProps) => {
  return <Avatar size='sm' mt='6px' borderRadius='6px' {...params} />
}

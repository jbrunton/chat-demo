import React from 'react'
import { Avatar, AvatarProps } from '@chakra-ui/react'
import { SystemIcon } from '../icons/System'
import { UserIcon } from '../icons/User'

type UserAvatarProps = Pick<AvatarProps, 'icon' | 'backgroundColor' | 'referrerPolicy' | 'src'>

export const UserAvatar = (params: UserAvatarProps) => {
  return <Avatar size='sm' mt='6px' ml='6px' borderRadius='6px' {...params} />
}

export const SystemAvatar = () => <UserAvatar icon={<SystemIcon />} backgroundColor={'primary'} />

export const DefaultUserAvatar = () => <UserAvatar icon={<UserIcon />} />

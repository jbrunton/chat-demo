import React from 'react'
import { User } from '../../../data/users'
import { SystemIcon } from '../../atoms/icons/System'
import { DefaultUserIcon } from '../../atoms/icons/User'
import { UserAvatar } from '../../atoms/users/UserAvatar'

export type AuthorAvatarProps = {
  author: User | undefined
}

export const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ author }) => {
  const isSystem = author?.id === 'system'
  return (
    <>
      {isSystem ? (
        <UserAvatar icon={<SystemIcon />} backgroundColor={'primary'} />
      ) : author?.picture ? (
        <UserAvatar src={author?.picture} referrerPolicy='no-referrer' />
      ) : (
        <UserAvatar icon={<DefaultUserIcon />} />
      )}
    </>
  )
}

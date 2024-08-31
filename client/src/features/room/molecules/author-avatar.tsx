import React from 'react'
import { User } from '../../../data/users'
import { DefaultUserIcon } from '../atoms/default-user-icon'
import { SystemIcon } from '../atoms/system-icon'
import { UserAvatar } from '../atoms/user-avatar'

export type AuthorAvatarProps = {
  author: User | undefined
}

export const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ author }) => {
  const isSystem = author?.id === 'system'
  return (
    <>
      {isSystem ? (
        <UserAvatar icon={<SystemIcon />} backgroundColor='primary.500' />
      ) : author?.picture ? (
        <UserAvatar src={author?.picture} referrerPolicy='no-referrer' />
      ) : (
        <UserAvatar icon={<DefaultUserIcon />} />
      )}
    </>
  )
}

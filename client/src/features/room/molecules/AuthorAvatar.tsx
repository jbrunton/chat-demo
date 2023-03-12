import React from 'react'
import { User } from '../../../data/users'
import { DefaultUserIcon } from '../atoms/DefaultUserIcon'
import { SystemIcon } from '../atoms/SystemIcon'
import { UserAvatar } from '../atoms/UserAvatar'

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

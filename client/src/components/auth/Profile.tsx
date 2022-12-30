import React from 'react'
import { User } from '@auth0/auth0-react'

export const Profile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

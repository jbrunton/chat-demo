import React from 'react'
import { Button, Heading, Icon } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { AiOutlinePlusSquare, AiOutlineNumber } from 'react-icons/ai'
import { Room } from '../../../data/rooms'
import { useUserDetails } from '../../../data/users'

const NewRoomIcon = () => <Icon as={AiOutlinePlusSquare} />
const RoomIcon = () => <Icon as={AiOutlineNumber} />

export const RoomSelector = () => {
  const { roomId: selectedRoomId } = useParams()
  const { data: userDetails } = useUserDetails()
  const isSelected = (room: Room) => room.id === selectedRoomId
  return (
    <>
      <Heading size='sm' m='4'>
        Your Rooms
      </Heading>
      <Link to='/room/new'>
        <Button variant='drawer' leftIcon={<NewRoomIcon />}>
          New Room
        </Button>
      </Link>
      {userDetails?.rooms.map((room) => (
        <Link key={room.id} to={`/room/${room.id}`}>
          <Button variant='drawer' aria-selected={isSelected(room)} leftIcon={<RoomIcon />}>
            {room.name}
          </Button>
        </Link>
      ))}
    </>
  )
}

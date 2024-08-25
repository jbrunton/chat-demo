import { Button, Icon, Textarea, Spinner, VStack, Alert, AlertIcon, Spacer } from '@chakra-ui/react'
import React, { useState, KeyboardEventHandler, useRef, useEffect, ReactElement } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { usePostMessage } from '../../../data/messages'
import { RoomResponse, useJoinRoom } from '../../../data/rooms'
import { useUserDetails } from '../../../data/users'
import { can } from '../../../data/lib'

export type ChatBoxProps = {
  roomResponse: RoomResponse
}

const JoinAlert = ({ roomResponse }: ChatBoxProps): ReactElement => {
  const roomId = roomResponse.room.id

  const canJoin = can('join', roomResponse)
  const requiresApproval = roomResponse.room.joinPolicy === 'request'
  const awaitingApproval = roomResponse.status === 'PendingApproval'

  const { mutate: joinRoom, isLoading, isSuccess: isJoined } = useJoinRoom(roomId)

  useEffect(() => {
    if (isJoined) {
      window.location.reload()
    }
  }, [isJoined])

  if (canJoin) {
    if (requiresApproval && awaitingApproval) {
      return (
        <Alert status='info' variant='top-accent'>
          <AlertIcon />
          Awaiting approval from owner.
          <Spacer />
        </Alert>
      )
    }
    return (
      <Alert status='info' variant='top-accent'>
        <AlertIcon />
        Join this room to chat.
        <Spacer />
        <Button rightIcon={isLoading ? <Spinner /> : undefined} onClick={() => joinRoom()}>
          {requiresApproval ? 'Request to Join' : 'Join'}
        </Button>
      </Alert>
    )
  }

  return (
    <Alert status='info' variant='top-accent'>
      <AlertIcon />
      You need an invite to join.
    </Alert>
  )
}

export const ChatBox: React.FC<ChatBoxProps> = ({ roomResponse }: ChatBoxProps): ReactElement => {
  const roomId = roomResponse.room.id

  const [content, setContent] = useState<string>('')
  const { data: user, isLoading } = useUserDetails()
  const joined = user?.rooms.some((room) => room.id === roomId)
  const { mutate: postMessage, isLoading: isSending } = usePostMessage(roomId, content)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isSending) {
      setContent('')
      inputRef.current?.focus()
    }
  }, [isSending])

  const onSendClicked = () => {
    if (content.length > 0) {
      postMessage()
    }
  }

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSendClicked()
    }
  }

  if (!isLoading && !joined) {
    return <JoinAlert roomResponse={roomResponse} />
  }

  return (
    <VStack p='6px' align='end'>
      <Textarea
        ref={inputRef}
        disabled={isSending}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        resize='none'
        placeholder='Type a message'
      />
      {isSending ? (
        <Button variant='ghost' colorScheme='primary' disabled={true} rightIcon={<Spinner />}>
          Send
        </Button>
      ) : (
        <Button
          variant='ghost'
          colorScheme='primary'
          disabled={!content.length}
          onClick={onSendClicked}
          rightIcon={<Icon as={AiOutlineArrowRight} />}
        >
          Send
        </Button>
      )}
    </VStack>
  )
}

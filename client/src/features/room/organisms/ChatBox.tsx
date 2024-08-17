import { Button, Icon, Textarea, Spinner, VStack, Alert, AlertIcon, Spacer } from '@chakra-ui/react'
import React, { useState, KeyboardEventHandler, useRef, useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { usePostMessage } from '../../../data/messages'
import { useJoinRoom } from '../../../data/rooms'
import { useUserDetails } from '../../../data/users'

export type ChatBoxProps = {
  roomId: string
  canJoin: boolean
}

const JoinAlert = ({ roomId, canJoin }: ChatBoxProps) => {
  const { mutate: joinRoom, isLoading, isSuccess: isJoined } = useJoinRoom(roomId)

  useEffect(() => {
    if (isJoined) {
      window.location.reload()
    }
  }, [isJoined])

  if (canJoin) {
    return (
      <Alert status='info' variant='top-accent'>
        <AlertIcon />
        You need to join this room to chat.
        <Spacer />
        <Button rightIcon={isLoading ? <Spinner /> : undefined} onClick={() => joinRoom()}>
          Join
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

export const ChatBox: React.FC<ChatBoxProps> = ({ roomId, canJoin }: ChatBoxProps) => {
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
    return <JoinAlert roomId={roomId} canJoin={canJoin} />
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

import { Button, Flex, Icon, Input, Spinner } from '@chakra-ui/react'
import React, { useState, KeyboardEventHandler, useRef, useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useMessages, useMessagesSubscription, usePostMessage } from '../../data/messages'
import { useAccessToken } from '../../hooks/useAccessToken'
import { LoadingIndicator } from '../LoadingIndicator'
import { MessagesList } from './MessagesList'

export type ChatWidgetProps = {
  roomId: string
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ roomId }) => {
  const accessToken = useAccessToken()
  const inputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState<string>('')
  const { data: messages } = useMessages(roomId, accessToken)
  const { mutate, isLoading } = usePostMessage(roomId, content, accessToken)
  const [isSending, setIsSending] = useState<boolean>(false)

  useEffect(() => {
    if (isSending && !isLoading) {
      setContent('')
      setIsSending(false)
      inputRef.current?.focus()
    }
  }, [isLoading, isSending])

  useMessagesSubscription(roomId, accessToken)

  const sendMessage = () => {
    setIsSending(true)
    mutate()
  }

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  if (!messages) return <LoadingIndicator />

  return (
    <div>
      {<MessagesList messages={messages} />}
      <Flex mt='6px'>
        <Input
          ref={inputRef}
          disabled={isLoading}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Type a message'
        />
        {isLoading ? (
          <Button colorScheme='blue' disabled={true}>
            <Spinner />
          </Button>
        ) : (
          <Button colorScheme='blue' onClick={() => sendMessage()} rightIcon={<Icon as={AiOutlineArrowRight} />}>
            Send
          </Button>
        )}
      </Flex>
    </div>
  )
}

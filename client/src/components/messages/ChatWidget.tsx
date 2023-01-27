import { Button, Icon, Textarea, Spinner, VStack } from '@chakra-ui/react'
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
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState<string>('')
  const { data: messages } = useMessages(roomId, accessToken)
  const { mutate: postMessage, isLoading } = usePostMessage(roomId, content, accessToken)
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
    if (content.length > 0) {
      setIsSending(true)
      postMessage()
    }
  }

  const onKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage()
    }
  }

  if (!messages) return <LoadingIndicator />

  return (
    <div>
      {<MessagesList messages={messages} />}
      <VStack mt='6px' align='end'>
        <Textarea
          ref={inputRef}
          disabled={isLoading}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          resize='none'
          placeholder='Type a message'
        />
        {isLoading ? (
          <Button variant='ghost' colorScheme='blue' disabled={true} rightIcon={<Spinner />}>
            Send
          </Button>
        ) : (
          <Button
            variant='ghost'
            colorScheme='blue'
            disabled={!content.length}
            onClick={() => sendMessage()}
            rightIcon={<Icon as={AiOutlineArrowRight} />}
          >
            Send
          </Button>
        )}
      </VStack>
    </div>
  )
}

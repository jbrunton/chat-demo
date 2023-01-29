import { Button, Icon, Textarea, Spinner, VStack } from '@chakra-ui/react'
import React, { useState, KeyboardEventHandler, useRef, useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { usePostMessage } from '../../data/messages'
import { useAccessToken } from '../../hooks/useAccessToken'

export type ChatBoxProps = {
  roomId: string
}

export const ChatBox: React.FC<ChatBoxProps> = ({ roomId }: ChatBoxProps) => {
  const accessToken = useAccessToken()
  const [content, setContent] = useState<string>('')
  const { mutate: postMessage, isLoading: isSending } = usePostMessage(roomId, content, accessToken)
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
        <Button variant='ghost' colorScheme='blue' disabled={true} rightIcon={<Spinner />}>
          Send
        </Button>
      ) : (
        <Button
          variant='ghost'
          colorScheme='blue'
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

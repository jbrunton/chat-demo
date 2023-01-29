import { Button, Center, List, ListItem, Text, Icon } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { Message } from '../../data/messages'
import { MessagesGroup, MessagesGroupProps } from './MessageGroup'

export type MessagesListProps = {
  messages: Message[]
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const messageGroups = groupMessages(messages).reverse()
  const ref = useRef<HTMLUListElement>(null)

  const [isScrolled, setIsScrolled] = useState(false)

  const onScroll = () => {
    if (ref.current) {
      setIsScrolled(ref.current.scrollTop < 0)
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', onScroll)
    }
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', onScroll)
      }
    }
  }, [ref])

  const scrollToRecent = () => {
    if (ref.current) {
      ref.current.scrollTop = 0
    }
  }

  return (
    <>
      {isScrolled && (
        <Center position='fixed' width='100%'>
          <Button
            variant='ghost'
            size='sm'
            colorScheme='blue'
            onClick={scrollToRecent}
            rightIcon={<Icon as={AiOutlineArrowDown} />}
          >
            Scroll to recent
          </Button>
        </Center>
      )}

      <List ref={ref} spacing={3} flex='1' overflowY='auto' display='flex' flexDirection='column-reverse' m='6px'>
        {messageGroups.length === 0 ? (
          <EmptyRow />
        ) : (
          messageGroups.map((params, index) => <MessagesGroup key={`group-${index}`} {...params} />)
        )}
      </List>
    </>
  )
}

const groupMessages = (messages: Message[]): MessagesGroupProps[] => {
  const sameGroup = (msg1: Message, msg2: Message): boolean =>
    msg1.authorId === msg2.authorId && msg1.recipientId === msg2.recipientId

  return messages.reduce((groups: MessagesGroupProps[], message: Message) => {
    const currentGroup = groups[groups.length - 1]
    const lastMessage = currentGroup?.messages[0]
    if (lastMessage && sameGroup(message, lastMessage)) {
      currentGroup.messages.push(message)
    } else {
      groups.push({
        authorId: message.authorId,
        messages: [message],
      })
    }
    return groups
  }, [])
}

const EmptyRow = () => (
  <ListItem>
    <Text as='em' fontSize='sm'>
      Be the first person to say something
    </Text>
  </ListItem>
)

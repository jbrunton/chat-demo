import React from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useEffect } from 'react'
import hljs from 'highlight.js'
import './formatted-message.css'

export type FormattedMessageProps = {
  content: string
}

export const FormattedMessage = ({ content }: FormattedMessageProps) => {
  useEffect(() => {
    hljs.highlightAll()
  }, [])
  return <div className='message' dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
}

marked.setOptions({
  gfm: true,
  breaks: true,
})

const formatContent = (content: string) => {
  return DOMPurify.sanitize(marked.parse(content, { async: false }))
}

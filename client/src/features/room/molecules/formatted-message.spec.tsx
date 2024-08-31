import React from 'react'
import { render, screen } from '@testing-library/react'
import { FormattedMessage } from './formatted-message'
import '@testing-library/jest-dom'

describe('FormattedMessage', () => {
  it('renders the content', () => {
    render(<FormattedMessage content='Hello, World!' />)
    expect(screen.getByText('Hello, World!'))
  })

  it('renders content as markdown', () => {
    const content = '# Action Items\n* Item 1\n* Item 2'

    render(<FormattedMessage content={content} />)

    expect(screen.getByRole('heading')).toHaveTextContent('Action Items')
    expect(screen.getAllByRole('list')).toMatchInlineSnapshot(`
      [
        <ul>
          

          <li>
            Item 1
          </li>
          

          <li>
            Item 2
          </li>
          

        </ul>,
      ]
    `)
  })
})

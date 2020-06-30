import test from 'ava'

import {
  Embed
} from 'embed'

import {
  PageBuilder
} from './'

const testEmbeds: Embed[] = [
  {
    title: 'Test Embed, 1',
    type: 'rich'
  },
  {
    title: 'Test Embed, 2',
    type: 'rich'
  },
  {
    title: 'Test Embed, 3',
    type: 'rich'
  }
]

const client = {
  id: 'some-random-id'
}

const message = {
  author: 'some-author-id'
}

const builder: PageBuilder = new PageBuilder(client, message)

test('page builder | add pages', (t) => {
  builder.addPages(testEmbeds)

  t.is(builder.pages, testEmbeds)
})


# Eris Pages

A base fork of [eris-pagination](https://github.com/riyacchi/eris-pagination), with some different features

## Base Features

All base features are the same as [eris-pagination](https://github.com/riyacchi/eris-pagination)

## New Features

We know handle Custom Reactions, or ***"Action Buttons"*** a simple
way to create a custom reaction to do some custom thing example:

```ts
import {
  ActionButton,
  PageBuilder
} from 'eris-pages'

// Embeds
const msgEmbeds = [
  {
    title: "An fantastic embed",
    description: "This embed is amazing"
  },
  {
    title: "Funny Video #1",
    description: "CalebCity - Any RPG game ever"
  },
  {
    title: "Funny Video #2",
    description: "rdcworld1 - How swordsmen be in anime"
  }
]

// Custom Action
const embedAction = {
  emote: '🎬'
  run: (msg) => msg.createMessage(`Hello, Action!`)
}

// Message Handler
const builder = new PageBuilder(client, message)

const built = await builder
  .addPages(msgEmbeds)
  .addAction(embedAction)
  .construct()

built.start()
```

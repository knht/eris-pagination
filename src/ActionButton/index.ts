import {
  Message,
} from 'eris'

export interface ActionButton {
  emote: string
  run: (msg: Message) => void | Promise<void>
}

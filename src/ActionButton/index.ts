import {
  Client,
  Message,
} from 'eris'

export interface ActionButton {
  emote: string
  run: (
    msg: Message,
    client: Client,
    invoker: string,
  ) => void | Promise<void>
}

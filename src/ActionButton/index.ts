export class ActionButton {
  emote: string
  run: (...args: any) => void

  constructor (
    actionEmote: string,
    action: (...args: any) => void
  ) {
    this.emote = actionEmote
    this.run = action
  }
}


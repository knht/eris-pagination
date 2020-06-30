export class ActionButton {
  emote: string
  runAction: Action

  constructor (
    actionEmote: string,
    action: Action
  ) {
    this.emote = actionEmote
    this.runAction = action
  }
}

export type Action = (...args: any) => void

export interface ActionOptions {
  buttonEmote: string
}

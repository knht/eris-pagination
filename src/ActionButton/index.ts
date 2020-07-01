
export class ActionButton {

  public readonly actionEmote: string
  public readonly action: () => void | Promise<void>

  constructor (
    actionEmote: string,
    action: () => void | Promise<void>,
  ) {
    this.actionEmote = actionEmote
    this.action = action
  }

}

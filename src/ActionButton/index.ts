
export class ActionButton {

  public readonly actionEmote: string
  public readonly action: () => Promise<void>

  constructor (
    actionEmote: string,
    action: () => Promise<void>,
  ) {
    this.actionEmote = actionEmote
    this.action = action
  }

}

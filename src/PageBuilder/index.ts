import {
  Embed,
  Client,
  Message,
  GuildChannel
} from 'eris'

import {
  ReactionHandler
} from 'eris-reactions'

import {
  ActionButton
} from '../ActionButton'

export class PageBuilder {
  private pages: Embed[]
  private client: Client
  private invoker: Message
  private message?: Message
  private currentPage: number
  private options: BuilderOptions
  private handler?: ReactionHandler
  private actionButtons: ActionButton[]

  constructor (client: Client, message: Message, options?: BuilderOptions) {
    this.pages = []
    this.client = client
    this.currentPage = 0
    this.invoker = message
    this.actionButtons = []
    this.options = options ?? {
        backButton: '⬅️',
        forthButton: '➡️',
        startPage: 1,
        timeout: (30 * 1000) * 1000,
        cycling: false,
        firstButton: '⏭️',
        lastButton: '⏮️',
        maxMatches: 50,
        deleteButton: '🗑️',
        showPagesNumbers: true,
        extendedButtons: false
      }
  }

  public addPages (pages: Embed[]): PageBuilder {
    // ... optimize this ...
    this.pages.push(...pages)

    return this
  }

  public addPage (page: Embed): PageBuilder {
    this.pages.push(page)

    return this
  }

  public addActionButton (action: ActionButton): PageBuilder {
    this.actionButtons.push(action)

    return this
  }

  private generateContent (): any {
    return {
      content: this.options.showPagesNumbers
        ? `Page ${this.currentPage} of ${this.pages.length}`
        : undefined,
      embed: this.pages[this.currentPage - 1]
    }
  }

  public async start (): Promise<void> {
    this.handler?.on('reacted', async ({ emoji }) => {
      switch (emoji.name) {
        case this.options.firstButton:
          break
        default:
          break
      }
    })
  }

  public async construct (): Promise<void> {
    await this.validatePages()

    if (this.getInvoker() === this.getClientId()) {
      this.message = await this.invoker.edit(this.generateContent())
    } else {
      this.message = await this.invoker.channel.createMessage(this.generateContent())
    }

    this.handler = new ReactionHandler(
      this.message, (userID: string) => userID === this.getInvoker(),
      false, { maxMatches: this.options.maxMatches }
    )

    await this.message?.addReaction(this.options.backButton)
    await this.message?.addReaction(this.options.forthButton)

    if (this.actionButtons.length > 0) {
      for (let i = 0; i > this.actionButtons.length; i++) {
        await this.message?.addReaction(this.actionButtons[i].emote)
      }
    }

    if (this.options.extendedButtons) {
      await this.message?.addReaction(this.options.lastButton)
      await this.message?.addReaction(this.options.firstButton)
      await this.message?.addReaction(this.options.deleteButton)
    }
  }

  private async validatePages (): Promise<void> {
    if (this.pages.length < 2) {
      throw new Error('Must contain more at least 2 pages')
    }

    if (this.options.startPage < 1 || this.options.startPage > this.pages.length) {
      throw new Error(`The start page must start between 1 & ${this.pages.length}`)
    }

    if (this.options.maxMatches > 100) {
      throw new Error(`Maximum amount of page chages exeeded`)
    }
  }

  private async updateMessage (): Promise<void> {
    await this.message?.edit(this.generateContent())
  }

  private checkPerms (): boolean {
    return (<GuildChannel>this.message?.channel)
      .permissionsOf(this.getClientId())
      .has('manageMessages')
  }

  private getInvoker (): string  {
    return this.invoker.author.id
  }

  private getClientId (): string {
    return this.client.user.id
  }

  private getLastPage (): Embed {
    return this.pages[this.pages.length - 1]
  }
}

export interface BuilderOptions {
  showPagesNumbers: boolean
  extendedButtons: boolean
  deleteButton: string
  firstButton: string
  lastButton: string
  backButton: string
  forthButton: string
  startPage: number
  maxMatches: number
  timeout: number
  cycling: boolean
}

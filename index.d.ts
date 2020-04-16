import { Message, EmbedBase } from 'eris';

declare module 'eris-pagination' {

  /**
   * An optional options object for overwriting defaults
   */
  interface PaginationOptions {
    /** Whether or not to show the current page index over the embed. Defaults to: true */
    showPageNumbers?: boolean;
    /** Whether or not to show extended control buttons besides standard pagination (First & Last page, deleting) */
    extendedButtons?: boolean;
    /** Cycle through all embeds jumping from the first page to the last page on going back and from the last page to the first page going forth. Defaults to: false */
    cycling?: boolean;
    /** How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100 */
    maxMatches?: number;
    /** How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes) */
    timeout?: number;
    /** Emoji which should be used as the delete button. This MUST be a unicode emoji! Defaults to: 🗑 */
    deleteButton?: string;
    /** Emoji which should be used as the first page button. This MUST be a unicode emoji! Defaults to: ⏮ */
    firstButton?: string;
    /** Emoji which should be used as the last page button. This MUST be a unicode emoji! Defaults to: ⏭ */
    lastButton?: string;
    /** Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅ */
    backButton?: string;
    /** Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡ */
    forthButton?: string;
    /** Which page of the submitted embed array should be shown first. Defaults to: 1 (The 1st page / element in the array) */
    startPage?: number;
  }

  /**
   * Create an Embed Paginator
   * @param message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
   * @param pages An array containing all embed objects 
   * @param options An optional options object for overwriting defaults
   */
  function createPaginationEmbed(message: Message, pages: EmbedBase[], options?: PaginationOptions): Promise<Message>;

}
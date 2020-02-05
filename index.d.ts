import { Message, EmbedBase } from 'eris';

declare namespace ErisPagination {

  interface PaginationOptions {
    showPageNumbers?: boolean;
    extendedButtons?: boolean;
    cycling?: boolean;
    maxMatches?: number;
    timeout?: number;
    deleteButton?: string;
    firstButton?: string;
    lastButton?: string;
    backButton?: string;
    forthButton?: string;
    startPage?: number;
  }

  function createPaginationEmbed(message: Message, pages: EmbedBase, options?: PaginationOptions): Promise<Message>;

}
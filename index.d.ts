// Type definitions for eris-pagination v0.2.2
// Project: eris-pagination
// Author: riyacchi <https://github.com/riyacchi/>
// Definitions by: CircuitRCAY <https://github.com/CircuitCodes>

declare module 'eris-pagination' {
    import { Message, EmbedOptions } from 'eris';

    class PaginationEmbed {
        constructor(message: Message, pages: EmbedOptions[], options?: PaginationEmbedOptions);
        public initialize(): Promise<void>;
        public run(): void;
        public update(): void;
    }

    interface PaginationEmbedOptions {
        showPageNumbers?: boolean;
        extendedButtons?: boolean;
        maxMatches?: number;
        timeout?: number;
        deleteButton?: string;
        firstButton?: string;
        lastButton?: string;
        backButton?: string;
        forthButton?: string;
        startPage?: number;
    }

    export function createPaginationEmbed(message: Message, pages: EmbedOptions[], options?: PaginationEmbedOptions): Promise<void>;
}

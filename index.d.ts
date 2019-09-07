// Type definitions for eris-pagination v0.2.2
// Project: eris-pagination
// Author: riyacchi <https://github.com/riyacchi/>
// Definitions by: CircuitRCAY <https://github.com/CircuitCodes>

import {PaginationEmbed} from "./lib/PaginationEmbed";
import {Message, EmbedOptions} from "eris";

export = PaginationEmbed;

declare class PaginationEmbed {
    /**
     * Constructor for the Embed Paginator
     * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
     * @param {EmbedOptions[]} pages An array containing all embed objects 
     * @param {PaginationEmbedOptions} options An optional options object for overwriting defaults
     */
    constructor(message: Message, pages: EmbedOptions[], options?: PaginationEmbedOptions);

    /**
     * Runs a set of initialization checks, sets up the reaction listener for continuous listening and displays the initial Embed
     * @async
     */

    async initialize()

    /**
     * Updates the embed's content with the new page
     */
    update()

    /**
     * Main method handling the reaction listening and content updating
     */
    run()

    /**
        * Constructor for the Embed Paginator
        * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
        * @param {EmbedOptions[]} pages An array containing all embed objects 
        * @param {PaginationEmbedOptions} options An optional options object for overwriting defaults     
    */

    async createPaginationEmbed(message: Message, pages: EmbedOptions[], options: PaginationEmbedOptions)
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

/**
    * Constructor for the Embed Paginator
    * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
    * @param {EmbedOptions[]} pages An array containing all embed objects 
    * @param {PaginationEmbedOptions} options An optional options object for overwriting defaults     
*/

declare async function createPaginationEmbed(message: Message, pages: EmbedOptions[], options: PaginationEmbedOptions)


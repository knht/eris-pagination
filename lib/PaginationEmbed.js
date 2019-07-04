'use strict';

const ReactionHandler = require('eris-reactions');

/**
 * Embed Pagination class
 * @class PaginationEmbed
 * @classdesc Handles the creation, listening and updating of paginated Rich Embeds
 */
class PaginationEmbed {
    /**
     * Constructor for the Embed Paginator
     * @param {Eris#Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
     * @param {Object[]} pages An array containing all embed objects 
     * @param {Object} options An optional options object for overwriting defaults
     * @property {Boolean} options.showPageNumbers Whether or not to show the current page index over the embed. Defaults to: true
     * @property {Number} options.maxMatches How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100
     * @property {Number} options.timeout How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes)
     * @property {String} options.backButton Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅
     * @property {String} options.forthButton Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡
     * @property {Number} options.startPage Which page of the submitted embed array shoulb be shown first. Defaults to: 1 (The 1st page / element in the array)
     */
    constructor(message, pages = [], options = {}) {
        this.pages      = pages;
        this.invoker    = message;
        this.options    = options;
        this.back       = options.backButton    || '⬅';
        this.forth      = options.forthButton   || '➡';
        this.page       = options.startPage     || 1;
        this.maxMatches = options.maxMatches    || 50;
        this.timeout    = options.timeout       || 300000;
        this.showPages  = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
    }

    /**
     * Runs a set of initialization checks, sets up the reaction listener for continuous listening and displays the initial Embed
     * @async
     */
    async initialize() {
        if (this.pages.length < 2) {
            return Promise.reject(new Error('A Pagination Embed must contain at least 2 pages!'));
        }

        if (this.page < 1 || this.page > this.pages.length) {
            return Promise.reject(new Error(`Invalid start page! Must be between 1 (first) and ${this.pages.length} (last)`));
        }

        if (this.maxMatches > 100) {
            return Promise.reject(new Error('Maximum amount of page changes exceeded! Must be under 100!'));
        }

        if (this.timeout > 900000) {
            return Promise.reject(new Error('Embed Timeout too high! Maximum pagination lifespan allowed is 15 minutes (900000 ms)!'));
        }
        
        this.message = await this.invoker.channel.createMessage({
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1]
        });

        this.handler = new ReactionHandler.continuousReactionStream(this.message, (userID) => userID === this.invoker.author.id, { maxMatches: this.maxMatches, time: this.timeout });

        await this.message.addReaction(this.back);
        await this.message.addReaction(this.forth);
    }

    /**
     * Main method handling the reaction listening and content updating
     */
    run() {
        this.handler.on('reacted', async (event) => {
            switch (event.emoji.name) {
                case this.back: {
                    await this.message.removeReaction(this.back, this.invoker.author.id);

                    if (this.page > 1) {
                        this.page--;
                        this.message.edit({
                            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
                            embed: this.pages[this.page - 1]
                        });
                    }

                    break;
                }

                case this.forth: {
                    await this.message.removeReaction(this.forth, this.invoker.author.id);

                    if (this.page < this.pages.length) {
                        this.page++;
                        this.message.edit({
                            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
                            embed: this.pages[this.page - 1]
                        });
                    }

                    break;
                }
            }
        });
    }
}

module.exports = {
    createPaginationEmbed: async (message, pages, options) => {
        const paginationEmbed = new PaginationEmbed(message, pages, options);
        await paginationEmbed.initialize();
        paginationEmbed.run();
    }
};
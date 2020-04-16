'use strict';

const ReactionHandler = require('eris-reactions');

/**
 * @typedef {import('eris').EmbedBase} EmbedBase
 * @typedef {import('eris').Message} Message
 * @typedef {Object} PaginationOptions An optional options object for overwriting defaults
 * @property {Boolean} [showPageNumbers] Whether or not to show the current page index over the embed. Defaults to: true
 * @property {Boolean} [extendedButtons] Whether or not to show extended control buttons besides standard pagination (First & Last page, deleting)
 * @property {Boolean} [cycling] Cycle through all embeds jumping from the first page to the last page on going back and from the last page to the first page going forth. Defaults to: false
 * @property {Number} [maxMatches] How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100
 * @property {Number} [timeout] How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes)
 * @property {String} [deleteButton] Emoji which should be used as the delete button. This MUST be a unicode emoji! Defaults to: 🗑
 * @property {String} [firstButton] Emoji which should be used as the first page button. This MUST be a unicode emoji! Defaults to: ⏮
 * @property {String} [lastButton] Emoji which should be used as the last page button. This MUST be a unicode emoji! Defaults to: ⏭
 * @property {String} [backButton] Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅
 * @property {String} [forthButton] Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡
 * @property {Number} [startPage] Which page of the submitted embed array shoulb be shown first. Defaults to: 1 (The 1st page / element in the array)
 */
/**
 * Embed Pagination class
 * @class PaginationEmbed
 * @classdesc Handles the creation, listening and updating of paginated Rich Embeds
 */
class PaginationEmbed {
    /**
     * Constructor for the Embed Paginator
     * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. If sent by the client, the message will be edited.
     * @param {EmbedBase[]} pages An array containing all embed objects 
     * @param {PaginationOptions} [options] An optional options object for overwriting defaults
     */
    constructor(message, pages = [], options = {}) {
        this.pages      = pages;
        this.invoker    = message;
        this.options    = options;
        this.delete     = options.deleteButton  || '🗑';
        this.firstPage  = options.firstButton   || '⏮';
        this.lastPage   = options.lastButton    || '⏭';
        this.back       = options.backButton    || '⬅';
        this.forth      = options.forthButton   || '➡';
        this.page       = options.startPage     || 1;
        this.maxMatches = options.maxMatches    || 50;
        this.timeout    = options.timeout       || 300000;
        this.cycling    = options.cycling       || false
        this.showPages  = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
        this.advanced   = (typeof options.extendedButtons !== 'undefined') ? options.extendedButtons : false;
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

        const messageContent = {
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1]
        }
        
        if (this.invoker.author.id === this.invoker._client.user.id) {
            this.message = await this.invoker.edit(messageContent);
        } else {
            this.message = await this.invoker.channel.createMessage(messageContent)
        }

        this.handler = new ReactionHandler.continuousReactionStream(this.message, (userID) => userID === this.invoker.author.id, false, { maxMatches: this.maxMatches, time: this.timeout });

        if (this.advanced) {
            await this.message.addReaction(this.firstPage);
            await this.message.addReaction(this.back);
            await this.message.addReaction(this.forth);
            await this.message.addReaction(this.lastPage);
            await this.message.addReaction(this.delete);
        } else {
            await this.message.addReaction(this.back);
            await this.message.addReaction(this.forth);
        }
    }

    /**
     * Updates the embed's content with the new page
     */
    update() {
        this.message.edit({
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1]
        });
    }

    /**
     * Check if the client can remove the reaction
     * @returns {Boolean}
     */
    checkPerms() {
        return this.message.channel.guild && this.message.channel.permissionsOf(this.message._client.user.id).has('manageMessages');
    }

    /**
     * Main method handling the reaction listening and content updating
     */
    run() {
        this.handler.on('reacted', async (event) => {
            switch (event.emoji.name) {
                case this.firstPage: {
                    if (this.advanced) {
                        if (this.checkPerms()) {
                            await this.message.removeReaction(this.firstPage, this.invoker.author.id);
                        }

                        if (this.page > 1) {
                            this.page = 1;
                            this.update();
                        }

                        break;
                    }
                }

                case this.back: {
                    if (this.checkPerms()) {
                        await this.message.removeReaction(this.back, this.invoker.author.id);
                    }

                    if (this.page > 1) {
                        this.page--;
                        this.update();
                    } else if (this.page === 1 && this.cycling === true) {
                        this.page = this.pages.length;
                        this.update();
                    }

                    break;
                }

                case this.forth: {
                    if (this.checkPerms()) {
                        await this.message.removeReaction(this.forth, this.invoker.author.id);
                    }

                    if (this.page < this.pages.length) {
                        this.page++;
                        this.update();
                    } else if (this.page === this.pages.length && this.cycling === true) {
                        this.page = 1;
                        this.update();
                    }

                    break;
                }

                case this.lastPage: {
                    if (this.advanced) {
                        if (this.checkPerms()) {
                            await this.message.removeReaction(this.lastPage, this.invoker.author.id);
                        }

                        if (this.page < this.pages.length) {
                            this.page = this.pages.length;
                            this.update();
                        }

                        break;
                    }

                    break;
                }

                case this.delete: {
                    if (this.advanced) {
                        return new Promise((resolve, reject) => {
                            if (this.checkPerms()) {
                                this.message.removeReactions().then(() => {
                                    resolve();
                                });
                            } else {
                                reject(new Error('Insufficient permissions to remove reactions'))
                            }
                        });
                    }

                    break;
                }
            }
        });
    }
}

module.exports = {
    /**
     * Create an Embed Paginator
     * 
     * @param {Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. If sent by the client, the message will be edited.
     * @param {EmbedBase[]} pages An array containing all embed objects 
     * @param {PaginationOptions} [options] An optional options object for overwriting defaults
     */
    createPaginationEmbed: async (message, pages, options) => {
        const paginationEmbed = new PaginationEmbed(message, pages, options);
        await paginationEmbed.initialize();
        paginationEmbed.run();

        return Promise.resolve(paginationEmbed.message);
    }
};
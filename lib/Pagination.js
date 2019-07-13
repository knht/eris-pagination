'use strict';

const ReactionHandler = require('eris-reactions');

/**
 * Base Pagination class
 * @class PaginationBase
 * @classdesc Base Pagination creation
 */


class PaginationBase {
	/**
     * Constructor for the Base Paginator
     * @param {Eris#Message} message A message object emitted from a messageCreate event coming from Eris, used as an invoker. 
     * @param {Object[]} pages An array containing all objects 
     * @param {Object} options An optional options object for overwriting defaults
     * @property {Boolean} options.showPageNumbers Whether or not to show the current page index over the embed. Defaults to: true
     * @property {Boolean} options.extendedButtons Whether or not to show extended control buttons besides standard pagination (First & Last page, deleting)
     * @property {Number} options.maxMatches How often the reaction handler should listen for a reaction (How often the paginator can be used). Defaults to: 50. Maximum: 100
     * @property {Number} options.timeout How long the paginator should work before the reaction listener times out. Defaults to: 300000ms (5 minutes). Maximum: 900000ms (15 minutes)
     * @property {String} options.deleteButton Emoji which should be used as the delete button. This MUST be a unicode emoji! Defaults to: 🗑
     * @property {String} options.firstButton Emoji which should be used as the first page button. This MUST be a unicode emoji! Defaults to: ⏮
     * @property {String} options.lastButton Emoji which should be used as the last page button. This MUST be a unicode emoji! Defaults to: ⏭
     * @property {String} options.backButton Emoji which should be used as the back button. This MUST be a unicode emoji! Defaults to: ⬅
     * @property {String} options.forthButton Emoji which should be used as the forth button. This MUST be a unicode emoji! Defaults to: ➡
     * @property {Number} options.startPage Which page of the submitted array shoulb be shown first. Defaults to: 1 (The 1st page / element in the array)
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
        this.showPages  = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
        this.advanced   = (typeof options.extendedButtons !== 'undefined') ? options.extendedButtons : false;
    }
	
	
	async initializeBase() {
		if (this.pages.length < 2) {
            return Promise.reject(new Error('A Pagination must contain at least 2 pages!'));
        }

        if (this.page < 1 || this.page > this.pages.length) {
            return Promise.reject(new Error(`Invalid start page! Must be between 1 (first) and ${this.pages.length} (last)`));
        }

        if (this.maxMatches > 100) {
            return Promise.reject(new Error('Maximum amount of page changes exceeded! Must be under 100!'));
        }

        if (this.timeout > 900000) {
            return Promise.reject(new Error('Pagination Timeout too high! Maximum pagination lifespan allowed is 15 minutes (900000 ms)!'));
        }
    }
	
	async initializeBaseEnd() {
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
     * Main method handling the reaction listening and content updating
     */
    run() {
        this.handler.on('reacted', async (event) => {
            switch (event.emoji.name) {
                case this.firstPage: {
                    if (this.advanced) {
                        await this.message.removeReaction(this.firstPage, this.invoker.author.id);

                        if (this.page > 1) {
                            this.page = 1;
                            this.update();
                        }

                        break;
                    }
                }

                case this.back: {
                    await this.message.removeReaction(this.back, this.invoker.author.id);

                    if (this.page > 1) {
                        this.page--;
                        this.update();
                    }

                    break;
                }

                case this.forth: {
                    await this.message.removeReaction(this.forth, this.invoker.author.id);

                    if (this.page < this.pages.length) {
                        this.page++;
                        this.update();
                    }

                    break;
                }

                case this.lastPage: {
                    if (this.advanced) {
                        await this.message.removeReaction(this.lastPage, this.invoker.author.id);

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
                        return new Promise((resolve) => {
                            this.message.removeReactions().then(() => {
                                resolve();
                            });
                        });
                    }

                    break;
                }
            }
        });
    }
} 



/**
 * Text Pagination class
 * @class PaginationText
 * @classdesc Handles the creation, listening and updating of paginated Text
 */
class PaginationText extends PaginationBase {
	constructor(message, pages, options) {
		super(message, pages, options);
	}
	
	async initialize() {	
        this.message = await this.invoker.channel.createMessage({
			content: this.pages[this.page - 1],
			embed: (this.showPages) ? {footer: {text: `Page ${this.page} of ${this.pages.length}`}} : undefined
        });
    }

    /**
     * Updates the text content with the new page
     */
    update() {
        this.message.edit({
			content: this.pages[this.page - 1],
            embed: (this.showPages) ? {footer: {text: `Page ${this.page} of ${this.pages.length}`}} : undefined
        });
    }
}



/**
 * Embed Pagination class
 * @class PaginationEmbed
 * @classdesc Handles the creation, listening and updating of paginated Rich Embeds
 */
class PaginationEmbed extends PaginationBase {
	constructor(message, pages, options) {
		super(message, pages, options);
	}
	
	async initialize() {	
        this.message = await this.invoker.channel.createMessage({
            content: (this.showPages) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1]
        });
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
}



/**
 * Mixed Pagination class
 * @class PaginationMixed
 * @classdesc Handles the creation, listening and updating of paginated pagination
 */
class PaginationMixed extends PaginationBase {
	constructor(message, pages, options) {
		super(message, pages, options);
	}
	
	async initialize() {	
        this.message = await this.invoker.channel.createMessage(
            this.pages[this.page - 1]
        );
    }

    /**
     * Updates the content with the new page
     */
    update() {
        this.message.edit(
            this.pages[this.page - 1]
        );
    }
}


module.exports = {
	createPaginationText: async (message, pages, options) => {
        const paginationText = new PaginationText(message, pages, options);
		await paginationText.initializeBase();
        await paginationText.initialize();
		await paginationText.initializeBaseEnd();
        paginationText.run();
	},
	
    createPaginationEmbed: async (message, pages, options) => {
        const paginationEmbed = new PaginationEmbed(message, pages, options);
        await paginationEmbed.initializeBase();
		await paginationEmbed.initialize();
		await paginationEmbed.initializeBaseEnd();
        paginationEmbed.run();
    },
	
	createPagination: async (message, pages, options) => {
        const paginationMixed = new PaginationMixed(message, pages, options);
        await paginationMixed.initializeBase();
		await paginationMixed.initialize();
		await paginationMixed.initializeBaseEnd();
        paginationMixed.run();
    }
};

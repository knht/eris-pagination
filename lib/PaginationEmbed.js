const ReactionHandler = require('eris-reactions');

class PaginationEmbed {
    constructor(message, pages = [], options = {}) {
        this.pages = pages;
        this.invoker = message;
        this.options = options;
        this.back = options.backButton || '⬅';
        this.forth = options.forthButton || '➡';
        this.page = options.startPage || 1;
        this.maxMatches = options.maxMatches || 50;
        this.timeout = options.timeout || 300000;
        this.showPageNumbers = (typeof options.showPageNumbers !== 'undefined') ? options.showPageNumbers : true;
        this.message;
        this.handler;
    }

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
            content: (this.showPageNumbers) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
            embed: this.pages[this.page - 1]
        });

        this.handler = new ReactionHandler.continuousReactionStream(this.message, (userID) => userID === this.invoker.author.id, { maxMatches: this.maxMatches, time: this.timeout });

        await this.message.addReaction(this.back);
        await this.message.addReaction(this.forth);
    }

    run() {
        this.handler.on('reacted', async (event) => {
            switch (event.emoji.name) {
                case this.back: {
                    await this.message.removeReaction(this.back, this.invoker.author.id);

                    if (this.page > 1) {
                        this.page--;
                        this.message.edit({
                            content: (this.showPageNumbers) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
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
                            content: (this.showPageNumbers) ? `Page **${this.page}** of **${this.pages.length}**` : undefined,
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
# Eris Pagination
Eris Pagination is a super simple to use **Embed Paginator** for the Node.js Discord library  [Eris.](https://github.com/abalabahaha/eris)

The API is *very* straight forward but also offers a big amount of customizability as well!

# Getting Started
Simply install Eris Pagination via NPM by typing `npm install eris-pagination` into your existing project and require the module wherever you need. That's it!

# API
There's only a single method needed for creating paginated Embeds with Eris:
```js
EmbedPaginator.createPaginationEmbed(message, embeds, options);
```
- **Eris.Message** `message` - An Eris message emitted from the `messageCreate` event.
- **Object[]** `embeds` - An array containing all Embed objects you want to use with the paginator.
- **Object** `options` - An object containing optional settings to overwrite the default behavior of Eris Paginator.
    - **Boolean** `options.showPageNumbers` - Whether to show *"Page **n** of **m**"* over the Embed.
        - Optional: **Yes**
        - Default: **True**
    - **Number** `options.startPage` - Which page (element) of the provided array to show first initially.
        - Optional: **Yes**
        - Default: **1**
    - **Number** `options.maxMatches` - Maximum amount of reaction button clicks to listen for.
        - Optional: **Yes**
        - Default: **50**
        - Maximum: **100**
    - **Number** `options.timeout` - Duration for how long the pagination embed should work for.
        - Optional: **Yes**
        - Default: **300000** *(5 minutes)*
        - Maximum: **900000** *(15 minutes)*
    - **String** `options.backButton` - Emoji used as the back button. **Must be Unicode!**
        - Optional: **Yes**
        - Default: **⬅**
    - **String** `options.forthButton` - Emoji used as the forth button. **Must be Unicode!**
        - Optional: **Yes**
        - Default: **➡**

# Examples
**Simple paginator without additional options:**
```js
const Eris = require('eris');
const EmbedPaginator = require('eris-pagination');
const bot = new Eris('BOT_TOKEN');

bot.on('ready', () => {
    console.log('Ready!');
});

bot.on('messageCreate', async (message) => {
    if (message.content === '!test') {
        const myEmbeds = [
            { title: 'Test Embed 1', color: 0x2ECC71 },
            { title: 'Test Embed 2', color: 0xE67E22 },
            { title: 'Test Embed 3', color: 0xE74C3C }
        ];

        EmbedPaginator.createPaginationEmbed(message, myEmbeds);
    }
});

bot.connect();
```
<div align="center">

![](https://img.kirameki.one/qlrgKF98.gif)

</div>

<hr>

**Advanced paginator with overwriting options:**
```js
const Eris = require('eris');
const EmbedPaginator = require('eris-pagination');
const bot = new Eris('BOT_TOKEN');

bot.on('ready', () => {
    console.log('Ready!');
});

bot.on('messageCreate', async (message) => {
    if (message.content === '!test') {
        const myEmbeds = [
            { title: 'Test Embed 1', color: 0x2ECC71 },
            { title: 'Test Embed 2', color: 0xE67E22 },
            { title: 'Test Embed 3', color: 0xE74C3C }
        ];

        EmbedPaginator.createPaginationEmbed(
            message, 
            myEmbeds, 
            {
                showPageNumbers: false,
                maxMatches: 10,
                timeout: 150000,
                backButton: '◀',
                forthButton: '▶',
                startPage: 2
            }
        );
    }
});

bot.connect();
```

<div align="center">

![](https://img.kirameki.one/BQMNzlqJ.gif)

</div>

# License
This repository makes use of the [MIT License](https://opensource.org/licenses/MIT) and all of its correlating traits.

While it isn't mandatory, a small credit if this repository was to be reused would be highly appreciated!

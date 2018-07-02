'use strict';

let ReMarksRenderers = {
    'preformatted_monospaced_code': e => `<pre><code>\n${e.content}</code></pre>\n`,
                      'blockquote': e => `<blockquote>\n${e.content}</blockquote>\n`,
                         'heading': e => `<h${e.options.level}>${e.content}</h${e.options.level}>\n`,
                 'horizontal_rule': e => '<hr>\n',
                       'paragraph': e => `<p>${e.content}</p>\n`
};

module.exports = ReMarksRenderers;
